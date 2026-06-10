"use client";
import { useEffect, useRef } from "react";
import { useInView, useSpring, useMotionValueEvent, useReducedMotion } from "framer-motion";

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export default function Counter({ value, suffix = "", prefix = "", className = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });
  const reduceMotion = useReducedMotion();

  const spring = useSpring(0, { stiffness: 60, damping: 18, mass: 1 });

  const format = (n: number) =>
    prefix + (value >= 1000 ? n.toLocaleString() : String(n)) + suffix;

  useEffect(() => {
    if (!inView) return;
    // Honour reduced-motion: snap to the final value instead of animating.
    if (reduceMotion) spring.jump(value);
    else spring.set(value);
  }, [inView, value, spring, reduceMotion]);

  useMotionValueEvent(spring, "change", (latest) => {
    if (ref.current) ref.current.textContent = format(Math.round(latest));
  });

  return (
    <span ref={ref} className={className}>
      {format(0)}
    </span>
  );
}
