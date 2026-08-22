"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; phase: number; speed: number };

export default function AnimatedBackground({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let stars: Star[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((width * height) / 9000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 0.9 + 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.8 + 0.3,
      }));
    };

    const FILAMENTS = 46;

    const draw = (time: number) => {
      const t = time / 1000;
      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        const twinkle = 0.35 + 0.35 * Math.sin(t * s.speed + s.phase);
        ctx.beginPath();
        ctx.fillStyle = `rgba(226, 232, 245, ${twinkle})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      const bandTop = height * 0.34;
      const bandHeight = height * 0.42;
      ctx.lineCap = "round";
      for (let i = 0; i < FILAMENTS; i++) {
        const k = i / (FILAMENTS - 1);
        const baseY = bandTop + k * bandHeight;
        const amp = bandHeight * (0.1 + 0.22 * Math.sin(k * Math.PI));
        const phase = t * (0.18 + k * 0.12) + k * 5.5;
        const freq = 1.1 + k * 0.55;
        const alpha = 0.05 + 0.16 * Math.sin(k * Math.PI);

        ctx.beginPath();
        for (let x = -20; x <= width + 20; x += 8) {
          const p = x / Math.max(width, 1);
          const swell = Math.sin(p * Math.PI);
          const y =
            baseY +
            Math.sin(p * Math.PI * freq * 2 + phase) * amp * swell +
            Math.sin(p * Math.PI * 5 + phase * 1.7) * amp * 0.16 * swell;
          if (x === -20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(240, 244, 200, ${alpha})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      for (let i = 0; i < 5; i++) {
        const k = (i + 0.5) / 5;
        const baseY = bandTop + k * bandHeight;
        const amp = bandHeight * 0.2;
        const phase = t * 0.26 + i * 2.2;
        ctx.beginPath();
        for (let x = -20; x <= width + 20; x += 8) {
          const p = x / Math.max(width, 1);
          const swell = Math.sin(p * Math.PI);
          const y = baseY + Math.sin(p * Math.PI * 2.4 + phase) * amp * swell;
          if (x === -20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(248, 250, 226, 0.34)";
        ctx.lineWidth = 1;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "rgba(233, 237, 180, 0.55)";
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      if (!reduced) frame = requestAnimationFrame(draw);
    };

    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none h-full w-full ${className}`} />;
}
