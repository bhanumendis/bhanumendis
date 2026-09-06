"use client";
import { useEffect } from "react";

/* ══════════════════════════════════════════════════════════════════
   SMOOTH SCROLL — inertial wheel physics, ~1.5 KB, zero dependencies
   ──────────────────────────────────────────────────────────────────
   This is the Lenis effect without Lenis. The house rule (see CLAUDE.md)
   is no animation library, and the reason applies doubly here: Lenis
   ships ~12 KB and, in its default mode, does exactly what the loop
   below does — intercept the wheel, keep a target scroll position, and
   ease the REAL document scroll toward it every frame.

   Easing the real scroll position (rather than transforming a wrapper)
   is the load-bearing detail. `animation-timeline: scroll()` and
   `view()` in motion.css read the document's own scroll offset, so a
   transform-based smoother would silently freeze the entire motion
   system. This one keeps every native scroll timeline driving.

   Where it deliberately does NOT run:
     · coarse pointers — iOS/Android momentum scrolling is already
       tuned to the device and hijacking it feels like lag, not weight
     · prefers-reduced-motion — a hard stop, same as motion.css
     · below 901px — matches the breakpoint the rest of the site uses
   The <html data-smooth="on"> flag is stamped pre-paint in layout.tsx
   so CSS can disable `scroll-behavior:smooth` before the first frame
   instead of fighting it afterwards.

   Native scrolling is never blocked: keyboard, scrollbar dragging,
   anchor jumps and window.scrollTo all run untouched, and the loop
   re-syncs to wherever they left the page on the next wheel tick.
   ══════════════════════════════════════════════════════════════════ */

// How much of the remaining distance is covered each frame. Higher is
// snappier; 0.115 lands close to Lenis' default feel at 60fps.
const EASE = 0.115;
// Wheel deltas arrive in three units. Lines and pages need converting.
const LINE_HEIGHT = 18;

export default function SmoothScroll() {
  useEffect(() => {
    if (document.documentElement.getAttribute("data-smooth") !== "on") return;

    let target = window.scrollY;
    let current = target;
    let active = false;
    let raf = 0;

    const maxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const loop = () => {
      const distance = target - current;
      // Snap the last sub-pixel and hand control back to the browser, so an
      // idle page costs nothing and native scrolling stays authoritative.
      if (Math.abs(distance) < 0.35) {
        current = target;
        window.scrollTo(0, current);
        active = false;
        raf = 0;
        return;
      }
      current += distance * EASE;
      window.scrollTo(0, current);
      raf = requestAnimationFrame(loop);
    };

    const onWheel = (e: WheelEvent) => {
      // Pinch-zoom and browser-zoom gestures ride on the wheel event; leave
      // them entirely alone.
      if (e.ctrlKey || e.metaKey || e.defaultPrevented) return;
      // Let a scrollable panel inside the page (a code block, the skills
      // overflow row) consume its own wheel before we take the document's.
      let node = e.target as HTMLElement | null;
      while (node && node !== document.body) {
        if (node.dataset && node.dataset.noSmooth !== undefined) return;
        node = node.parentElement;
      }

      const delta =
        e.deltaMode === 1
          ? e.deltaY * LINE_HEIGHT
          : e.deltaMode === 2
            ? e.deltaY * window.innerHeight
            : e.deltaY;

      // Re-sync before adding: the page may have moved via keyboard, an
      // anchor jump or the scrollbar since the last wheel tick.
      if (!active) current = target = window.scrollY;

      target = Math.min(maxScroll(), Math.max(0, target + delta));
      e.preventDefault();

      if (!active) {
        active = true;
        raf = requestAnimationFrame(loop);
      }
    };

    // A native smooth scroll (anchor link, back-to-top) must win outright.
    const release = () => {
      if (!active) return;
      active = false;
      cancelAnimationFrame(raf);
      raf = 0;
      current = target = window.scrollY;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", release);
    window.addEventListener("pointerdown", release);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", release);
      window.removeEventListener("pointerdown", release);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
