"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades the child upward into view when it enters the viewport. Uses
 * IntersectionObserver so it's much lighter than a motion library — no
 * subscription overhead per scroll frame. The observer disconnects after
 * the first reveal so revealing once is permanent (won't re-trigger on
 * scroll-up).
 *
 * Respects prefers-reduced-motion: the transition becomes a no-op and the
 * content renders in its final state immediately.
 *
 * Usage: wrap each top-level section's content. Don't wrap the Hero — it
 * should be visible on first paint, not staggered in.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  /** ms to delay the transition once visible (for staggered children). */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}
