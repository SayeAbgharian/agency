import { useMemo } from "react";
import { motion } from "framer-motion";
import type { MotionStyle } from "framer-motion";

interface Star {
  left: number;
  top: number;
  size: number;
  alpha: number;
  hue: number;
}

/** Seeded, so the sky is the same on every visit instead of reshuffling on each render. */
function makeStars(count: number, seed: number): Star[] {
  let state = seed;
  const rand = () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
  return Array.from({ length: count }, () => ({
    left: rand() * 100,
    top: rand() * 100,
    size: 1 + rand() * rand() * 2.2,
    alpha: 0.3 + rand() * 0.7,
    hue: Math.floor(rand() * 3),
  }));
}

/**
 * One depth layer of the night sky that carries the hero's stardust across every page.
 * The stars are scattered at random, never on a grid; the parent moves the layer (scroll or pointer).
 */
export default function StarField({
  count,
  seed,
  className = "",
  style,
}: {
  count: number;
  seed: number;
  className?: string;
  style?: MotionStyle;
}) {
  const stars = useMemo(() => makeStars(count, seed), [count, seed]);
  return (
    <motion.div className={`star-layer ${className}`} style={style} aria-hidden="true">
      {stars.map((star, i) => (
        <span
          key={i}
          className={`star star-${star.hue}${star.size > 2.2 ? " star-bright" : ""}`}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            opacity: star.alpha,
          }}
        />
      ))}
    </motion.div>
  );
}
