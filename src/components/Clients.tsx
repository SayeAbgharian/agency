import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "framer-motion";

import { clients } from "../data/content";
import type { Client } from "../data/content";
import { PauseIcon, PlayIcon } from "./Icons";

/** Pixels per second. */
const SPEED = 36;

function Mark({ shape }: { shape: Client["mark"] }) {
  return (
    <svg viewBox="0 0 24 24" className="client-mark" aria-hidden="true">
      {shape === "circle" && <circle cx="12" cy="12" r="9" fill="currentColor" />}
      {shape === "diamond" && <path d="M12 2l10 10-10 10L2 12z" fill="currentColor" />}
      {shape === "arc" && <path d="M3 18a9 9 0 0 1 18 0" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />}
      {shape === "bars" && <path d="M4 20V10M10 20V4M16 20v-7M22 20V8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />}
      {shape === "ring" && <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="3.2" />}
      {shape === "triangle" && <path d="M12 3l10 18H2z" fill="currentColor" />}
      {shape === "wave" && <path d="M2 14c3-6 6-6 10 0s7 6 10 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />}
      {shape === "dot" && (
        <>
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" fill="currentColor" />
        </>
      )}
    </svg>
  );
}

function Logos({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="clients-group" aria-hidden={hidden || undefined}>
      {clients.map((client) => (
        <li key={client.name} className="client">
          {client.logo ? (
            <img src={client.logo} alt={client.name} loading="lazy" />
          ) : (
            <>
              <Mark shape={client.mark} />
              <span lang="en">{client.name}</span>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * Brands that worked with the agency, drifting slowly to the right in an endless loop.
 * Hovering the strip eases it to a stop; the button stops it for keyboard and touch users.
 */
export default function Clients() {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<HTMLDivElement>(null);
  const width = useRef(0);
  const speed = useRef(SPEED);
  const x = useMotionValue(0);

  useEffect(() => {
    const group = groupRef.current?.firstElementChild;
    if (!group) return;
    const observer = new ResizeObserver(() => {
      width.current = group.getBoundingClientRect().width;
    });
    observer.observe(group);
    return () => observer.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (reduced || !width.current) return;
    const target = paused || hovered ? 0 : SPEED;
    // Ease toward the target speed, so stopping and starting glide instead of snapping.
    speed.current += (target - speed.current) * Math.min(1, delta / 260);
    if (Math.abs(speed.current) < 0.05 && target === 0) return;
    // Right-to-left layout: the copies line up to the left, so moving right by one copy's width loops seamlessly.
    let next = x.get() + (speed.current * delta) / 1000;
    if (next >= width.current) next -= width.current;
    x.set(next);
  });

  return (
    <section className="clients" aria-labelledby="clients-title">
      <div className="container clients-head">
        <h2 id="clients-title" className="clients-title">
          برندهایی که با ما کار کرده‌اند
        </h2>
        {!reduced && (
          <button
            type="button"
            className="icon-button clients-toggle"
            aria-pressed={paused}
            aria-label={paused ? "ادامه حرکت لوگوها" : "توقف حرکت لوگوها"}
            title={paused ? "پخش" : "توقف"}
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? <PlayIcon /> : <PauseIcon />}
          </button>
        )}
      </div>

      <div
        className={`clients-strip ${reduced ? "is-static" : ""}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span className="neon-line" aria-hidden="true" />
        <motion.div ref={groupRef} className="clients-track" style={reduced ? undefined : { x }}>
          <Logos />
          {!reduced && <Logos hidden />}
          {!reduced && <Logos hidden />}
        </motion.div>
        <span className="neon-line is-reverse" aria-hidden="true" />
      </div>
      <p className="clients-note">لوگوهای موقت؛ تا جایگزینی با برندهای واقعی</p>
    </section>
  );
}
