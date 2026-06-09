"use client";
import { useEffect, useRef } from "react";
import { useInView, useSpring, useMotionValueEvent } from "framer-motion";

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export default function Counter({ value, suffix = "", prefix = "", className = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });

  const spring = useSpring(0, {
    stiffness: 60,
    damping: 18,
    mass: 1,
  });

  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, value, spring]);

  useMotionValueEvent(spring, "change", (latest) => {
    if (ref.current) {
      const rounded = Math.round(latest);
      ref.current.textContent =
        prefix + (value >= 1000 ? rounded.toLocaleString() : String(rounded)) + suffix;
    }
  });

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}