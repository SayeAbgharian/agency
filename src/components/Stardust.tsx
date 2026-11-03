import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { useReducedMotion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  phase: number;
  depth: number;
  color: number;
}

/**
 * Slow, twinkling dust in the three brand hues, rising behind the statue.
 * Draws only while the hero is on screen and not paused; nothing at all under reduced motion.
 */
export default function Stardust({
  paused,
  mx,
  my,
}: {
  paused: boolean;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const restartRef = useRef<() => void>(() => {});
  const reduced = useReducedMotion();

  useEffect(() => {
    pausedRef.current = paused;
    if (!paused) restartRef.current();
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || reduced) return;

    const readPalette = () => {
      const style = getComputedStyle(canvas);
      return ["--indigo", "--violet", "--orchid", "--dust-white"].map((name) => style.getPropertyValue(name).trim() || "#ffffff");
    };
    let palette = readPalette();
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let last = 0;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const count = window.innerWidth < 700 ? 38 : 80;
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: 0.5 + Math.random() * 1.5,
      speed: 0.008 + Math.random() * 0.028,
      phase: Math.random() * Math.PI * 2,
      depth: 0.35 + Math.random() * 0.65,
      color: Math.floor(Math.random() * 4),
    }));

    const resize = () => {
      const box = canvas.getBoundingClientRect();
      width = box.width;
      height = box.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (time: number) => {
      const dt = Math.min(0.05, (time - last) / 1000 || 0);
      last = time;
      context.clearRect(0, 0, width, height);
      const offsetX = mx.get() * 40;
      const offsetY = my.get() * 30;
      for (const p of particles) {
        p.y -= p.speed * p.depth * dt;
        p.phase += dt * (0.8 + p.depth * 1.6);
        if (p.y < -0.03) {
          p.y = 1.03;
          p.x = Math.random();
        }
        const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(p.phase));
        const x = p.x * width + offsetX * p.depth;
        const y = p.y * height + offsetY * p.depth;
        const r = p.radius * (0.6 + p.depth * 0.6);
        context.globalAlpha = twinkle * p.depth * 0.9;
        context.fillStyle = palette[p.color];
        context.beginPath();
        context.arc(x, y, r, 0, Math.PI * 2);
        context.fill();
        if (p.radius > 1.6) {
          context.globalAlpha = twinkle * 0.12;
          context.beginPath();
          context.arc(x, y, r * 4, 0, Math.PI * 2);
          context.fill();
        }
      }
      context.globalAlpha = 1;
    };

    const loop = (time: number) => {
      draw(time);
      if (visible && !pausedRef.current) frame = requestAnimationFrame(loop);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      if (!visible || pausedRef.current) return;
      frame = requestAnimationFrame((time) => {
        last = time;
        loop(time);
      });
    };
    restartRef.current = start;

    resize();
    draw(performance.now());
    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    resizeObserver.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    visibility.observe(canvas);
    const themeWatch = new MutationObserver(() => {
      palette = readPalette();
    });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    start();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      themeWatch.disconnect();
      restartRef.current = () => {};
    };
  }, [reduced, mx, my]);

  if (reduced) return null;
  return <canvas ref={canvasRef} className="stardust" aria-hidden="true" />;
}
