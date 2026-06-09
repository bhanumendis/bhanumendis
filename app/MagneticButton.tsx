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

export default function MagneticButton({
  href,
  children,
  className = "",
  external = false,
  ariaLabel,
  strength = 0.25,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
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
      {children}
    </a>
  );
}