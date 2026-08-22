"use client";

export default function SectionHeading({ overline, title }: { overline: string; title: string }) {
  return (
    <div className="text-center">
      <p className="font-latin text-xs tracking-[0.32em] text-ink-muted">{overline}</p>
      <h2 className="mt-3 text-3xl font-bold text-glow-strong md:text-4xl">{title}</h2>
    </div>
  );
}
