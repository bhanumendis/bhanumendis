"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

// ── Memories: a 3-up coverflow ───────────────────────────────────────
// Replaces the old flat slideshow. Three slides read as visible (centre
// at full scale, the two flanks dimmed, scaled back and rotated on Y);
// a further pair mounts at zero opacity either side purely so a drag
// never has to mount a card mid-gesture, which pops.
//
// The drag is Pointer Events, not a physics library. The trick that
// keeps it cheap: the finger only ever drives one custom property
// (`--dragx`) written imperatively on the track, so a gesture causes no
// React re-render at all. Scale/rotate/opacity stay keyed to the
// DISCRETE offset, so releasing the pointer is an index change and the
// snap is a plain CSS transition on the house easing — running on the
// compositor, with no spring loop in JS.

const AUTOPLAY_MS = 5000;
// ±1 is what the design shows. ±2 is the invisible mount buffer.
const WINDOW = 2;
// Fraction of one slide-step a drag must cover before it commits.
const COMMIT_RATIO = 0.22;
// px/ms — a fast flick commits even if it never crosses COMMIT_RATIO.
const FLICK_VELOCITY = 0.45;

interface CoverflowProps {
  photos: readonly string[];
}

export default function Coverflow({ photos }: CoverflowProps) {
  const len = photos.length;
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const gesture = useRef({ id: -1, startX: 0, startT: 0, dx: 0, step: 1 });

  const go = useCallback(
    (dir: number) => setActive((a) => (a + dir + len) % len),
    [len],
  );

  // ── Reduced motion: no autoplay, and motion.css flattens the 3D. ──
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // ── Autoplay, yielding to hover, focus and the pointer. ──
  useEffect(() => {
    if (reduced || paused || dragging) return;
    const t = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [reduced, paused, dragging, go]);

  const setDragX = (px: number) => {
    trackRef.current?.style.setProperty("--dragx", `${px}px`);
  };

  // `is-dragging` kills the snap transition, so it has to land on the SAME
  // frame as the first --dragx write. Routing it through React state cost it
  // a frame, which showed up as the first few pixels of every drag easing
  // instead of tracking. The className in JSX is a constant, so React never
  // reconciles this class away.
  const setDragClass = (on: boolean) => {
    trackRef.current?.classList.toggle("is-dragging", on);
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const el = trackRef.current;
    if (!el) return;
    // One slide-step in px, measured once per gesture rather than per move.
    // Measured off a real slide: `--step` is an unregistered custom property,
    // so getPropertyValue would hand back the calc() token, not a length.
    const slide = el.querySelector<HTMLElement>(".cf-slide");
    const step = (slide?.offsetWidth ?? el.offsetWidth * 0.6) * 0.82;
    gesture.current = { id: e.pointerId, startX: e.clientX, startT: performance.now(), dx: 0, step };
    // Throws if the pointer is already gone; losing capture is survivable,
    // losing the gesture is not.
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* no capture */ }
    setDragClass(true);
    setDragging(true);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (g.id !== e.pointerId) return;
    g.dx = e.clientX - g.startX;
    // Rubber-band past the ends of a gesture so it never feels unbounded.
    setDragX(Math.sign(g.dx) * Math.min(Math.abs(g.dx), g.step * 1.15));
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (g.id !== e.pointerId) return;
    g.id = -1;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch { /* already released */ }
    const dt = Math.max(1, performance.now() - g.startT);
    const velocity = Math.abs(g.dx) / dt;
    const committed =
      Math.abs(g.dx) > g.step * COMMIT_RATIO || velocity > FLICK_VELOCITY;
    // Drag right (positive dx) reveals the card on the left → step back.
    if (committed) go(g.dx < 0 ? 1 : -1);
    setDragX(0);
    setDragClass(false);
    setDragging(false);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); setActive(len - 1); }
  };

  return (
    <div
      className="cf"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="cf-stage"
        data-cursor="drag"
        ref={trackRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Memories"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {photos.map((photo, i) => {
          // Wrap the raw distance into a signed offset around the active
          // card, so the rail is a loop rather than a line with two ends.
          const raw = (i - active + len) % len;
          const off = raw > len / 2 ? raw - len : raw;
          if (Math.abs(off) > WINDOW) return null;
          const isCentre = off === 0;
          return (
            <div
              key={photo}
              className="cf-slide"
              style={{ "--o": off } as CSSProperties}
              data-depth={Math.abs(off)}
              aria-hidden={!isCentre}
              // Only the centre card is a meaningful target; the flanks are
              // decoration until they become the centre.
              inert={!isCentre}
            >
              <Image
                src={photo}
                alt={isCentre ? `Memory ${i + 1} of ${len}` : ""}
                fill
                sizes="(max-width: 700px) 62vw, 300px"
                quality={82}
                priority={i === 0}
                draggable={false}
                className="cf-img"
              />
            </div>
          );
        })}
      </div>

      <div className="cf-controls">
        <button type="button" className="cf-nav" onClick={() => go(-1)} aria-label="Previous memory">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 19l-7-7 7-7" /></svg>
        </button>
        <p className="cf-indicator" aria-live="polite" aria-atomic="true">
          <span className="cf-indicator-n">{active + 1}</span>
          <span className="cf-indicator-sep">/</span>
          {len}
        </p>
        <button type="button" className="cf-nav" onClick={() => go(1)} aria-label="Next memory">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div className="cf-dots" role="tablist" aria-label="Choose a memory">
        {photos.map((photo, i) => (
          <button
            key={photo}
            type="button"
            role="tab"
            className={`cf-dot${i === active ? " active" : ""}`}
            aria-selected={i === active}
            aria-label={`Memory ${i + 1}`}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </div>
  );
}
