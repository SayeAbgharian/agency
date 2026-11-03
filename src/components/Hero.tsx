import { Fragment, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { heroSlides, images } from "../data/content";
import { ArrowIcon, PauseIcon, PlayIcon } from "./Icons";
import { Magnetic, ease } from "./Shared";
import Stardust from "./Stardust";

const statueMask: CSSProperties = {
  maskImage: `url(${images.statue.src})`,
  WebkitMaskImage: `url(${images.statue.src})`,
};

/** Ring tilt (degrees) per slide; the rings re-orient when the headline changes. */
const tilts = [
  { a: -13, b: 9 },
  { a: -4, b: 15 },
  { a: -20, b: 3 },
];
const rings = [
  { id: "a", cx: 320, cy: 250, rx: 304, ry: 74, speed: "11s" },
  { id: "b", cx: 320, cy: 540, rx: 252, ry: 58, speed: "15s" },
] as const;
const SLIDE_MS = 7000;

function RingLayer({ half, index, intro }: { half: "back" | "front"; index: number; intro: boolean }) {
  const reduced = useReducedMotion();
  return (
    <svg className={`hero-rings hero-rings-${half}`} viewBox="0 0 640 700" aria-hidden="true">
      <defs>
        <linearGradient id={`ring-grad-${half}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="640" y2="0">
          <stop offset="0" style={{ stopColor: "var(--ring-a)", stopOpacity: 0 }} />
          <stop offset="0.22" style={{ stopColor: "var(--ring-a)", stopOpacity: 0.85 }} />
          <stop offset="0.55" style={{ stopColor: "var(--ring-b)", stopOpacity: 1 }} />
          <stop offset="0.8" style={{ stopColor: "var(--ring-c)", stopOpacity: 0.85 }} />
          <stop offset="1" style={{ stopColor: "var(--ring-c)", stopOpacity: 0.1 }} />
        </linearGradient>
        <filter id={`ring-blur-${half}`} x="-10%" y="-60%" width="120%" height="220%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        {rings.map((ring) => (
          <clipPath key={ring.id} id={`clip-${half}-${ring.id}`} clipPathUnits="userSpaceOnUse">
            {half === "back" ? (
              <rect x="-40" y={ring.cy - ring.ry - 30} width="720" height={ring.ry + 30} />
            ) : (
              <rect x="-40" y={ring.cy} width="720" height={ring.ry + 30} />
            )}
          </clipPath>
        ))}
      </defs>
      {rings.map((ring) => {
        const tilt = tilts[index][ring.id];
        return (
          <g
            key={ring.id}
            className="ring-group"
            style={{ transform: `rotate(${tilt}deg)` }}
          >
            <g clipPath={`url(#clip-${half}-${ring.id})`}>
              <motion.ellipse
                className="ring-glow"
                cx={ring.cx}
                cy={ring.cy}
                rx={ring.rx}
                ry={ring.ry}
                stroke={`url(#ring-grad-${half})`}
                filter={`url(#ring-blur-${half})`}
                initial={reduced || !intro ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2.2, delay: ring.id === "a" ? 0.7 : 1, ease }}
              />
              <motion.ellipse
                className="ring-line"
                cx={ring.cx}
                cy={ring.cy}
                rx={ring.rx}
                ry={ring.ry}
                stroke={`url(#ring-grad-${half})`}
                initial={reduced || !intro ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.2, delay: ring.id === "a" ? 0.7 : 1, ease }}
              />
              {/* A point of light travelling the ring; it passes behind the statue on the back half. */}
              <ellipse
                className="ring-comet ring-comet-trail"
                cx={ring.cx}
                cy={ring.cy}
                rx={ring.rx}
                ry={ring.ry}
                pathLength={1000}
                style={{ "--speed": ring.speed } as CSSProperties}
              />
              <ellipse
                className="ring-comet ring-comet-head"
                cx={ring.cx}
                cy={ring.cy}
                rx={ring.rx}
                ry={ring.ry}
                pathLength={1000}
                style={{ "--speed": ring.speed } as CSSProperties}
              />
            </g>
          </g>
        );
      })}
    </svg>
  );
}

export default function Hero({ onConsult }: { onConsult: () => void }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [intro, setIntro] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const slide = heroSlides[index];

  useEffect(() => {
    const timer = window.setTimeout(() => setIntro(false), 3200);
    return () => window.clearTimeout(timer);
  }, []);

  // Pointer parallax: each layer moves by a different depth.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const statueX = useTransform(sx, (v) => v * 18);
  const statueY = useTransform(sy, (v) => v * 12);
  const backX = useTransform(sx, (v) => v * -12);
  const frontX = useTransform(sx, (v) => v * 28);
  const frontY = useTransform(sy, (v) => v * 16);
  const cloudX = useTransform(sx, (v) => v * -34);

  // Scroll parallax: the statue sinks slower than the page, the copy lifts away.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const visualScrollY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const copyScrollY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.15]);

  const goTo = (next: number) => setIndex((next + heroSlides.length) % heroSlides.length);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="hero"
      aria-labelledby="hero-title"
      data-paused={paused || !!reduced}
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== "mouse") return;
        mx.set(event.clientX / window.innerWidth - 0.5);
        my.set(event.clientY / window.innerHeight - 0.5);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <div className="hero-backlight" aria-hidden="true" />
      <Stardust paused={paused} mx={sx} my={sy} />

      <div className="container hero-grid">
        <motion.div
          className="hero-copy"
          style={reduced ? undefined : { y: copyScrollY, opacity: copyOpacity }}
        >
          <motion.p
            className="hero-eyebrow"
            initial={reduced ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease }}
          >
            <span aria-hidden="true" />
            ایده‌های خلاقانه، نتایج ماندگار
          </motion.p>

          <h1 id="hero-title">
            <motion.span
              className="h1-top"
              initial={reduced ? false : { opacity: 0, y: 34, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.42, ease }}
            >
              آژانس تبلیغاتی
            </motion.span>
            <span className="h1-rotator">
              <AnimatePresence mode={reduced ? "sync" : "wait"} initial={!reduced}>
                <motion.span key={slide.id} className="h1-phrase">
                  {/* Animated per word, never per letter: Persian letters must stay joined. */}
                  {slide.phrase.split(" ").map((word, i) => (
                    <Fragment key={word + i}>
                      {i > 0 && " "}
                      <motion.span
                        className="h1-word"
                        initial={reduced ? false : { opacity: 0, y: "0.55em", filter: "blur(12px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={reduced ? undefined : { opacity: 0, y: "-0.35em", filter: "blur(10px)", transition: { duration: 0.35, delay: i * 0.05 } }}
                        transition={{ duration: 0.85, delay: (intro ? 0.62 : 0.05) + i * 0.09, ease }}
                      >
                        {word}
                      </motion.span>
                    </Fragment>
                  ))}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>

          <div className="hero-description">
            <AnimatePresence mode={reduced ? "sync" : "wait"} initial={!reduced}>
              <motion.p
                key={slide.id}
                initial={reduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -10, transition: { duration: 0.3 } }}
                transition={{ duration: 0.7, delay: intro ? 0.9 : 0.2, ease }}
              >
                {slide.description}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.div
            className="hero-actions"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05, ease }}
          >
            <Magnetic>
              <button type="button" className="button button-primary" onClick={onConsult}>
                درخواست مشاوره رایگان
                {/* The arrow points in the RTL reading direction: this is the page's main action. */}
                <ArrowIcon className="button-arrow" />
              </button>
            </Magnetic>
            <a href="#portfolio" className="button button-ghost">
              مشاهده نمونه‌کارها
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual"
          style={reduced ? undefined : { y: visualScrollY }}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div className="layer" style={{ x: backX }}>
            <RingLayer half="back" index={index} intro={intro} />
          </motion.div>

          <motion.div className="layer statue-layer" style={{ x: statueX, y: statueY }}>
            <motion.div
              className="statue-rise"
              initial={reduced ? false : { opacity: 0, y: 70, scale: 0.94, filter: "blur(14px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.6, delay: 0.15, ease }}
            >
              <img
                className="statue"
                src={images.statue.src}
                alt={images.statue.alt}
                width={images.statue.width}
                height={images.statue.height}
                fetchPriority="high"
                decoding="async"
              />
              {/* Indigo-to-orchid colour grade and a slow light sweep, both clipped to the statue's silhouette. */}
              <span className="statue-light" aria-hidden="true" style={statueMask} />
              <span className="statue-sheen" aria-hidden="true" style={statueMask} />
            </motion.div>
          </motion.div>

          <motion.div className="layer" style={{ x: frontX, y: frontY }}>
            <RingLayer half="front" index={index} intro={intro} />
          </motion.div>

          <motion.div className="layer cloud-layer cloud-back" style={{ x: cloudX }} aria-hidden="true">
            <img src={images.clouds} alt="" width={2400} height={640} decoding="async" />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="hero-slides"
        role="group"
        aria-label="اسلایدهای معرفی"
        initial={reduced ? false : { opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.3, ease }}
      >
        {heroSlides.map((item, i) => (
          <button
            key={item.id}
            type="button"
            className={`slide-dot ${i === index ? "is-active" : ""}`}
            aria-label={`اسلاید ${i + 1}: ${item.phrase}`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => goTo(i)}
          >
            <span lang="en" className="slide-num">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="slide-track">
              {i === index && (
                // The fill is the autoplay timer: when its animation ends, the next slide shows.
                // Pausing freezes it in place (CSS), reduced motion removes the animation entirely.
                <span
                  key={`${item.id}-${index}`}
                  className="slide-fill"
                  style={{ animationDuration: `${SLIDE_MS}ms` }}
                  onAnimationEnd={() => goTo(index + 1)}
                />
              )}
            </span>
          </button>
        ))}
        {!reduced && (
          <button
            type="button"
            className="icon-button slide-pause"
            aria-label={paused ? "پخش دوباره حرکت‌ها" : "توقف حرکت‌ها"}
            aria-pressed={paused}
            title={paused ? "پخش" : "توقف"}
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? <PlayIcon /> : <PauseIcon />}
          </button>
        )}
      </motion.div>

      <div className="cloud-layer cloud-front" aria-hidden="true">
        <img src={images.clouds} alt="" width={2400} height={640} decoding="async" />
      </div>
    </section>
  );
}
