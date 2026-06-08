"use client";
import { useEffect, useRef, useCallback } from "react";

// ── Text Scramble ──
function scrambleText(el: HTMLElement) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&";
  const original = el.textContent || "";
  let frame = 0;
  const totalFrames = 18;

  const update = () => {
    let result = "";
    for (let i = 0; i < original.length; i++) {
      if (original[i] === " " || original[i] === "\n") {
        result += original[i];
      } else if (frame > i * 1.2) {
        result += original[i];
      } else {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    el.textContent = result;
    frame++;
    if (frame < original.length * 1.2 + totalFrames) {
      requestAnimationFrame(update);
    } else {
      el.textContent = original;
    }
  };
  requestAnimationFrame(update);
}

// ── Animated Counter ──
function animateCounter(el: HTMLElement) {
  const text = el.textContent || "";
  const match = text.match(/^([\d,]+)(\+?)$/);
  if (!match) return;

  const target = parseInt(match[1].replace(/,/g, ""), 10);
  const suffix = match[2] || "";
  const duration = 1800;
  const start = performance.now();

  const step = (now: number) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current = Math.floor(ease * target);

    if (target >= 1000) {
      el.textContent = current.toLocaleString() + suffix;
    } else {
      el.textContent = current + suffix;
    }

    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = text;
  };
  requestAnimationFrame(step);
}

export default function Effects() {
  const trailDotsRef = useRef<HTMLDivElement[]>([]);
  const keysRef = useRef<Set<string>>(new Set());

  // ── Cursor Trail ──
  const updateTrail = useCallback((x: number, y: number) => {
    trailDotsRef.current.forEach((dot, i) => {
      setTimeout(() => {
        if (dot) {
          dot.style.left = x + "px";
          dot.style.top = y + "px";
          dot.style.opacity = String(1 - i * 0.15);
          dot.style.transform = `translate(-50%,-50%) scale(${1 - i * 0.1})`;
        }
      }, i * 35);
    });
  }, []);

  useEffect(() => {
    // ── 1. Text Scramble on H1 ──
    setTimeout(() => {
      const h1 = document.querySelector(".h1") as HTMLElement;
      if (h1) scrambleText(h1);
    }, 200);

    // ── 2. Scroll Counters ──
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            if (!el.dataset.counted) {
              el.dataset.counted = "true";
              animateCounter(el);
              counterObserver.unobserve(el);
            }
          }
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll(".hsc-n, .sval").forEach((el) => counterObserver.observe(el));

    // ── 3. Magnetic Buttons ──
    const magneticEls = document.querySelectorAll<HTMLElement>(".btn-fill, .btn-out, .nav-cta, .cb.prim");
    const magnetHandlers: Array<[HTMLElement, (e: MouseEvent) => void, () => void]> = [];

    magneticEls.forEach((btn) => {
      btn.classList.add("btn-magnetic");
      const onMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const bx = rect.left + rect.width / 2;
        const by = rect.top + rect.height / 2;
        const dx = (e.clientX - bx) * 0.25;
        const dy = (e.clientY - by) * 0.25;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      };
      const onLeave = () => { btn.style.transform = ""; };
      btn.addEventListener("mousemove", onMove);
      btn.addEventListener("mouseleave", onLeave);
      magnetHandlers.push([btn, onMove, onLeave]);
    });

    // ── 4. Cursor Trail ──
    const trailContainer = document.createElement("div");
    trailContainer.setAttribute("aria-hidden", "true");
    document.body.appendChild(trailContainer);
    const dots: HTMLDivElement[] = [];
    for (let i = 0; i < 6; i++) {
      const dot = document.createElement("div");
      dot.className = "trail-dot";
      dot.style.opacity = "0";
      trailContainer.appendChild(dot);
      dots.push(dot);
    }
    trailDotsRef.current = dots;

    const onTrailMove = (e: MouseEvent) => updateTrail(e.clientX, e.clientY);
    document.addEventListener("mousemove", onTrailMove);

    // ── 5. Section Blur Transitions ──
    const blurObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove("section-blur");
          } else {
            if (e.target.id !== "hero") {
              e.target.classList.add("section-blur");
            }
          }
        });
      },
      { threshold: 0.15, rootMargin: "-5% 0px -5% 0px" }
    );
    document.querySelectorAll("section").forEach((s) => blurObserver.observe(s));

    // ── 6. Keyboard Easter Egg (B + M) ──
    const easterEgg = document.getElementById("easter-egg");
    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
      if (keysRef.current.has("b") && keysRef.current.has("m")) {
        easterEgg?.classList.add("active");
        setTimeout(() => easterEgg?.classList.remove("active"), 3000);
        keysRef.current.clear();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => { keysRef.current.delete(e.key.toLowerCase()); };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    if (easterEgg) {
      easterEgg.addEventListener("click", () => easterEgg.classList.remove("active"));
    }

    return () => {
      counterObserver.disconnect();
      blurObserver.disconnect();
      magnetHandlers.forEach(([btn, onMove, onLeave]) => {
        btn.removeEventListener("mousemove", onMove);
        btn.removeEventListener("mouseleave", onLeave);
      });
      document.removeEventListener("mousemove", onTrailMove);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      trailContainer.remove();
    };
  }, [updateTrail]);

  return (
    <div id="easter-egg" className="easter-egg" aria-hidden="true">
      <div>
        <div className="easter-egg-text">භානු මෙන්ඩිස්</div>
        <div className="easter-egg-sub">You found the secret · Press B+M · Click to close</div>
      </div>
    </div>
  );
}