import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import StarField from "./StarField";

/**
 * The night sky behind the whole page: a deep navy field, three soft lights (indigo, violet,
 * orchid), one aurora band and two depths of stars. Everything travels with the scroll position,
 * so the colour changes as the reader moves down the page: indigo-led at the top, orchid-led at
 * the closing call to action. Scroll-driven, never looping.
 */
export function Ambient() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 45, damping: 22, restDelta: 0.0005 });

  const indigoX = useTransform(p, [0, 0.5, 1], ["8vw", "70vw", "20vw"]);
  const indigoY = useTransform(p, [0, 0.5, 1], ["10vh", "45vh", "80vh"]);
  const indigoO = useTransform(p, [0, 0.55, 1], [1, 0.75, 0.35]);
  const violetX = useTransform(p, [0, 0.5, 1], ["78vw", "18vw", "70vw"]);
  const violetY = useTransform(p, [0, 0.5, 1], ["70vh", "20vh", "40vh"]);
  const orchidX = useTransform(p, [0, 0.5, 1], ["40vw", "85vw", "35vw"]);
  const orchidY = useTransform(p, [0, 0.5, 1], ["110vh", "75vh", "55vh"]);
  const orchidO = useTransform(p, [0, 0.5, 1], [0.35, 0.7, 1]);
  const orchidS = useTransform(p, [0, 1], [0.8, 1.25]);
  // The aurora band sweeps down the page and turns as it goes, like a light seen from a moving camera.
  const auroraY = useTransform(p, [0, 0.5, 1], ["-8vh", "34vh", "66vh"]);
  const auroraR = useTransform(p, [0, 0.5, 1], [-13, 5, -7]);
  const auroraO = useTransform(p, [0, 0.45, 1], [1, 0.65, 0.9]);
  // Two star depths drift up at different speeds, so the sky has depth while reading.
  const farY = useTransform(p, [0, 1], ["0vh", "-10vh"]);
  const nearY = useTransform(p, [0, 1], ["0vh", "-32vh"]);

  return (
    <div className="ambient" aria-hidden="true">
      <motion.span className="blob blob-indigo" style={reduced ? undefined : { x: indigoX, y: indigoY, opacity: indigoO }} />
      <motion.span className="blob blob-violet" style={reduced ? undefined : { x: violetX, y: violetY }} />
      <motion.span className="blob blob-orchid" style={reduced ? undefined : { x: orchidX, y: orchidY, opacity: orchidO, scale: orchidS }} />
      <motion.span className="aurora" style={reduced ? undefined : { y: auroraY, rotate: auroraR, opacity: auroraO }} />
      <StarField count={70} seed={7} className="star-layer-far" style={reduced ? undefined : { y: farY }} />
      <StarField count={26} seed={41} className="star-layer-near" style={reduced ? undefined : { y: nearY }} />
    </div>
  );
}

/** A faint light that trails the mouse across the background. Mouse users only, off under reduced motion. */
export function CursorLight() {
  const reduced = useReducedMotion();
  const [finePointer] = useState(() => window.matchMedia("(pointer: fine)").matches);
  const x = useSpring(-800, { stiffness: 110, damping: 24, mass: 0.6 });
  const y = useSpring(-800, { stiffness: 110, damping: 24, mass: 0.6 });

  useEffect(() => {
    if (reduced || !finePointer) return;
    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduced, finePointer, x, y]);

  if (reduced || !finePointer) return null;
  return <motion.div className="cursor-light" style={{ x, y }} aria-hidden="true" />;
}
