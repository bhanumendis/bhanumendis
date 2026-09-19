"use client";

import { useEffect, useRef } from "react";

// ── The scrubbed sky ─────────────────────────────────────────────────
// A video whose playhead is the scroll position: forward as you scroll
// down, backward as you scroll up. It never plays on its own clock, so
// it cannot drift out of step with the page.
//
// Seeking a video is not free and the requests do not queue, so the
// naive "set currentTime on every scroll event" approach stalls the
// decoder and stutters. Three rules keep it smooth, and each one is
// here because the obvious version fails without it:
//
//   1. Only one seek in flight. A second request while the first is
//      still resolving is dropped, not queued.
//   2. The displayed time eases toward the target instead of jumping,
//      so a fast flick becomes a glide rather than a series of jumps.
//   3. The loop parks when the target is reached.
//
// The canvas star field sits on top of this and stays interactive; the
// video is the painted backdrop, the canvas is the part that responds.

export default function ScrubSky({ srcs, poster }: { srcs: string[]; poster: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const vidRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    const vid = vidRef.current;
    if (!host || !vid) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dur = 0, shown = 0, want = 0;
    let seeking = false, raf = 0, running = false, onScreen = false;

    const progress = () => {
      const wrap = host.closest(".wb-scroll") as HTMLElement | null;
      if (!wrap) return 0;
      const r = wrap.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      if (span <= 0) return 0;
      return Math.min(1, Math.max(0, -r.top / span));
    };

    const frame = () => {
      if (!dur) { running = false; return; }
      want = progress() * dur;
      const d = want - shown;
      if (Math.abs(d) < 0.008) { running = false; return; }
      // Ease toward the target. A hard jump on every scroll event is what
      // makes a scrubbed video look like a slideshow.
      shown += d * 0.22;
      if (!seeking) {
        seeking = true;
        vid.currentTime = shown;
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!running && onScreen && !reduce) { running = true; raf = requestAnimationFrame(frame); } };

    const onSeeked = () => { seeking = false; };
    const onMeta = () => {
      dur = vid.duration || 0;
      // Park on the first frame rather than wherever the browser lands.
      try { vid.currentTime = reduce ? dur * 0.6 : 0; } catch {}
      start();
    };

    const io = new IntersectionObserver(
      (es) => { onScreen = es.some((e) => e.isIntersecting); if (onScreen) start(); },
      { rootMargin: "200px" }
    );
    io.observe(host);

    vid.addEventListener("loadedmetadata", onMeta);
    vid.addEventListener("seeked", onSeeked);
    window.addEventListener("scroll", start, { passive: true });
    window.addEventListener("resize", start);
    if (vid.readyState >= 1) onMeta();

    return () => {
      io.disconnect();
      vid.removeEventListener("loadedmetadata", onMeta);
      vid.removeEventListener("seeked", onSeeked);
      window.removeEventListener("scroll", start);
      window.removeEventListener("resize", start);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="sky" ref={hostRef} aria-hidden="true">
      {/* The poster carries the section on its own: if the video never
          loads, is blocked, or the connection is slow, what remains is
          the still frame the video was generated from. */}
      <video
        ref={vidRef}
        className="sky-v"
        poster={poster}
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
      >
        {srcs.map((u) => (
          <source key={u} src={u} type={u.endsWith(".webm") ? "video/webm" : "video/mp4"} />
        ))}
      </video>
    </div>
  );
}
