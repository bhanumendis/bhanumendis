"use client";
import { useRef, type ReactNode, type MouseEvent } from "react";

interface MagneticButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  ariaLabel?: string;
  strength?: number;
}

// Amplified "magnetic" button: the button eases toward the cursor, the label
// trails slightly for depth, and a soft radial sheen tracks the pointer.
// Everything is transform/opacity only, and it no-ops on touch devices.
export default function MagneticButton({
  href,
  children,
  className = "",
  external = false,
  ariaLabel,
  strength = 0.4,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  const handleMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
    if (inner.current) {
      // Label trails a little further for a parallax/tactile feel.
      inner.current.style.transform = `translate(${relX * strength * 0.35}px, ${relY * strength * 0.35}px)`;
    }
    // Expose the pointer position for the CSS sheen highlight.
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
    if (inner.current) inner.current.style.transform = "";
  };

  return (
    <a
      ref={ref}
      href={href}
      className={`btn-magnetic ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className="btn-magnetic-inner" ref={inner}>{children}</span>
    </a>
  );
}
