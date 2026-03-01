"use client";

import { MouseEvent, type HTMLAttributes, type ReactNode, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  spotlightColor?: string;
  spotlightRadius?: number;
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(153, 69, 255, 0.22)",
  spotlightRadius = 600,
  style,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [active, setActive] = useState(false);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
    onMouseMove?.(event);
  };

  const handleMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
    setOpacity(1);
    setActive(true);
    onMouseEnter?.(event);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    setOpacity(0);
    setActive(false);
    onMouseLeave?.(event);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-[color:var(--bg-surface)] text-[color:var(--text-primary)] transition-all duration-300 motion-reduce:transition-none hover:-translate-y-0.5",
        className,
      )}
      style={{
        borderColor: active ? "rgba(153, 69, 255, 0.35)" : "var(--border-subtle)",
        boxShadow: active
          ? "0 16px 40px rgba(153,69,255,0.18), 0 8px 24px rgba(0,140,76,0.14), 0 0 0 1px rgba(255,210,63,0.14)"
          : "var(--shadow-card)",
        ...style,
      }}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px z-0 transition-opacity duration-300 motion-reduce:hidden"
        style={{
          opacity,
          background: `radial-gradient(${spotlightRadius}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 motion-reduce:hidden"
        style={{
          opacity: active ? 1 : 0.45,
          background:
            "linear-gradient(125deg, rgba(153,69,255,0.10) 0%, rgba(25,251,155,0.08) 40%, rgba(0,140,76,0.10) 72%, rgba(255,210,63,0.08) 100%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default SpotlightCard;
