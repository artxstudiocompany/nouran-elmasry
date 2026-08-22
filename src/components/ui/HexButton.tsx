"use client";

import { type ReactNode } from "react";

export default function HexButton({
  children,
  onClick,
  variant = "ghost",
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: "solid" | "ghost";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`hex-clip px-9 py-3 text-[15px] font-semibold transition-[transform,background-color,color,box-shadow] duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-glow/70 ${
        variant === "solid"
          ? "bg-glow/15 text-glow-strong shadow-glow ring-1 ring-glow/70 hover:bg-glow/25"
          : "bg-night-deep/40 text-ink ring-1 ring-glow/35 hover:bg-glow/10 hover:text-glow-strong"
      }`}
      style={{ boxShadow: variant === "solid" ? "0 0 28px rgba(233,237,180,0.35)" : undefined }}
    >
      <span className="relative">{children}</span>
    </button>
  );
}
