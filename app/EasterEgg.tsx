"use client";

import { useEffect, useRef, useState } from "react";

// Classic B + M keyboard easter egg. Hold both keys together to reveal the
// glowing Sinhala signature; auto-dismisses after 3s, or on click / Escape.
export default function EasterEgg() {
  const [active, setActive] = useState(false);
  const keys = useRef<Set<string>>(new Set());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const isTyping = () => {
      const el = document.activeElement;
      if (!el) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        (el as HTMLElement).isContentEditable
      );
    };

    const reveal = () => {
      setActive(true);
      keys.current.clear();
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setActive(false), 3000);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setActive(false);
      if (e.repeat || isTyping()) return;
      keys.current.add(e.key.toLowerCase());
      if (keys.current.has("b") && keys.current.has("m")) reveal();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current.delete(e.key.toLowerCase());
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <div
      className={`easter-egg${active ? " active" : ""}`}
      aria-hidden={!active}
      onClick={() => setActive(false)}
    >
      <div>
        <div className="easter-egg-text sinhala">භානු මෙන්ඩිස්</div>
        <div className="easter-egg-sub">
          You found the secret · Press B+M · Click to close
        </div>
      </div>
    </div>
  );
}
