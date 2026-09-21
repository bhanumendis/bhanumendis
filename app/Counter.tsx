/**
 * © 2025–2026 Bhanu Mendis · https://bhanumendis.com
 * All rights reserved. Designed, built and maintained by Bhanu Mendis.
 * Unauthorised copying, redistribution or reuse of this file, in whole or in
 * part, is prohibited without written permission. See LICENSE.
 */
"use client";
import { useEffect, useRef } from "react";

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

// Deterministic on server and client alike: toLocaleString() with no locale
// follows the runtime's, which is how a server/browser pair ends up disagreeing
// about "26,000" vs "26.000" and failing hydration.
const fmt = (n: number, big: boolean) =>
  big ? Math.round(n).toLocaleString("en-US") : String(Math.round(n));

// Lightweight count-up: a single rAF loop that starts when the number scrolls
// into view. No animation library — keeps the JS bundle small and mobile fast.
// Honours prefers-reduced-motion by leaving the final value in place.
//
// The markup ships with the FINAL value, not "0". A crawler, a no-JS visitor
// or a screen reader arriving before the animation would otherwise read
// "0+ National awards" — a wrong fact, not a missing flourish. Visually nothing
// changes: globals.css holds `.ctr` invisible (only when JS is running, via
// the pre-paint data-js flag) until this effect resets it to zero and marks it
// live, so the real number never flashes ahead of its own count-up.
export default function Counter({ value, suffix = "", prefix = "", className = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const big = value >= 1000;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const format = (n: number) => prefix + fmt(n, big) + suffix;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.live = "1";
      return;
    }

    let raf = 0, start = 0, ran = false;
    const dur = 1400;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    // Hold the box at the final number's width for the length of the count.
    // Without it the stat card is laid out around "750+", collapses to "0+"
    // here, then grows back digit by digit — nudging its neighbours each time.
    const unlock = () => { el.style.minWidth = ""; el.style.display = ""; };
    el.style.minWidth = `${el.getBoundingClientRect().width}px`;
    el.style.display = "inline-block";
    el.textContent = format(0);
    el.dataset.live = "1";

    const step = (ts: number) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / dur, 1);
      el.textContent = format(value * easeOutCubic(t));
      if (t < 1) raf = requestAnimationFrame(step);
      else unlock();
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !ran) {
          ran = true;
          raf = requestAnimationFrame(step);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      // Never leave a half-counted number behind on unmount.
      el.textContent = format(value);
      unlock();
    };
  }, [value, suffix, prefix, big]);

  return (
    <span ref={ref} className={`ctr ${className}`.trim()}>
      {prefix}{fmt(value, big)}{suffix}
    </span>
  );
}
