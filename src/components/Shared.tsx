import { Fragment, useEffect, useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import { images } from "../data/content";
import type { Media } from "../data/content";
import { CloseIcon } from "./Icons";

export const ease = [0.22, 1, 0.36, 1] as const;

export function Image({
  media,
  className = "",
  eager = false,
  sizes,
}: {
  media: Media;
  className?: string;
  eager?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(0);
  return (
    <span className={`image-wrap ${className}`}>
      {failed < 2 ? (
        <img
          src={failed === 0 ? media.src : images.fallback}
          srcSet={failed === 0 ? media.srcSet : undefined}
          sizes={sizes}
          alt={media.alt}
          width={media.width}
          height={media.height}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding="async"
          style={{ objectPosition: media.position }}
          onError={() => setFailed((n) => n + 1)}
        />
      ) : (
        <span className="image-fallback" role="img" aria-label={media.alt}>
          تصویر بارگذاری نشد
        </span>
      )}
    </span>
  );
}

/** Fades content up into place the first time it scrolls into view. */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 30,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Heading whose words rise out of a blur one after another (never per letter: Persian letters stay joined). */
export function WordReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      className="word-reveal"
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      transition={{ staggerChildren: 0.09, delayChildren: delay }}
    >
      {text.split(" ").map((word, i) => (
        <Fragment key={word + i}>
          {i > 0 && " "}
          <motion.span
            className="word"
            variants={{
              hidden: { opacity: 0, y: "0.55em", filter: "blur(10px)" },
              show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.85, ease } },
            }}
          >
            {word}
          </motion.span>
        </Fragment>
      ))}
    </motion.span>
  );
}

/** Centered section heading with two rules that grow outward from the title. */
export function SectionTitle({
  id,
  title,
  subtitle,
}: {
  id: string;
  title: string;
  subtitle?: string;
}) {
  const reduced = useReducedMotion();
  const rule = {
    initial: reduced ? false : { scaleX: 0, opacity: 0 },
    whileInView: { scaleX: 1, opacity: 1 },
    viewport: { once: true, amount: 0.6 },
    transition: { duration: 1.1, delay: 0.25, ease },
  } as const;
  return (
    <div className="section-title">
      <motion.span className="st-rule st-rule-start" aria-hidden="true" {...rule} />
      <h2 id={id}>
        <WordReveal text={title} />
      </h2>
      <motion.span className="st-rule st-rule-end" aria-hidden="true" {...rule} />
      {subtitle && (
        <Reveal className="st-subtitle" delay={0.12} y={12}>
          <p>{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}

/** Pulls its child a little toward the mouse, so the main actions answer the pointer before the click. */
export function Magnetic({ children, strength = 0.28 }: { children: ReactNode; strength?: number }) {
  const reduced = useReducedMotion();
  const x = useSpring(0, { stiffness: 220, damping: 15, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 15, mass: 0.4 });
  return (
    <motion.span
      className="magnet"
      style={reduced ? undefined : { x, y }}
      onPointerMove={(event: PointerEvent<HTMLSpanElement>) => {
        if (reduced || event.pointerType !== "mouse") return;
        const box = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - (box.left + box.width / 2)) * strength);
        y.set((event.clientY - (box.top + box.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/**
 * Pointer handlers for a 3D tilt with a light that follows the cursor.
 * Writes --rx/--ry (tilt) and --gx/--gy (light position); CSS does the rest.
 */
export const tiltHandlers = (max = 7) => ({
  onPointerMove: (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const el = event.currentTarget;
    const box = el.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width;
    const py = (event.clientY - box.top) / box.height;
    el.style.setProperty("--rx", `${((0.5 - py) * max).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((px - 0.5) * max).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
  },
  onPointerLeave: (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--rx", "0deg");
    event.currentTarget.style.setProperty("--ry", "0deg");
  },
});

/**
 * A short neon line that keeps travelling around its parent's edge (the parent must be positioned).
 * pathLength makes the dash lengths percentages of the perimeter, so the speed is the same at any size.
 * `radius` must match the parent's border-radius.
 */
export function NeonFrame({ radius, className = "" }: { radius: number; className?: string }) {
  return (
    <svg className={`neon-frame ${className}`} aria-hidden="true">
      {["neon-tail", "neon-trail", "neon-head"].map((part) => (
        <rect key={part} className={part} width="100%" height="100%" rx={radius} pathLength={100} />
      ))}
    </svg>
  );
}

export function Brand() {
  return (
    <a className="brand" href="#home" aria-label="آژانس تبلیغاتی، بازگشت به ابتدای صفحه">
      {/* TODO: replace this slot with the agency's logo file once it is supplied. */}
      <span className="logo-slot" aria-hidden="true">
        لوگو
      </span>
      <span className="brand-name">آژانس تبلیغاتی</span>
    </a>
  );
}

export function Dialog({
  children,
  title,
  onClose,
  className = "",
}: {
  children: ReactNode;
  title: string;
  onClose: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const node = ref.current;
    const previous = document.documentElement.style.overflow;
    node?.showModal();
    node?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    document.documentElement.style.overflow = "hidden";
    return () => {
      node?.close();
      document.documentElement.style.overflow = previous;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-content">
        <button
          type="button"
          className="icon-button dialog-close"
          onClick={onClose}
          aria-label="بستن پنجره"
        >
          <CloseIcon />
        </button>
        {children}
      </div>
    </dialog>
  );
}
