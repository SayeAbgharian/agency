import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { MotionStyle } from "framer-motion";

import { images } from "../data/content";
import { ChevronIcon, OrbitGlyph } from "./Icons";
import { Image, NeonFrame, WordReveal, ease } from "./Shared";

export default function Introduction() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  // The frame starts fully clipped, which an observer on the frame itself reads as invisible,
  // so the reveal is triggered by the surrounding grid instead.
  const inView = useInView(gridRef, { once: true, amount: 0.3 });
  const { scrollYProgress } = useScroll({ target: visualRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const detailY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const badgeRotate = useTransform(scrollYProgress, [0, 1], [-120, 220]);
  const borderAngle = useTransform(scrollYProgress, [0, 1], ["20deg", "340deg"]);

  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div ref={gridRef} className="container about-grid">
        <motion.div
          className="about-card"
          initial={reduced ? false : { opacity: 0, x: -48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease }}
        >
          <NeonFrame radius={28} />
          <p className="kicker">
            <span aria-hidden="true" />
            درباره ما
          </p>
          <h2 id="about-title">
            <span>
              <WordReveal text="ما فقط تبلیغ نمی‌کنیم،" delay={0.2} />
            </span>
            <span className="accent-text">
              <WordReveal text="اثر می‌گذاریم." delay={0.5} />
            </span>
          </h2>
          <p className="about-text">
            با سال‌ها تجربه در دنیای بازاریابی و تبلیغات، به کسب‌وکار شما کمک
            می‌کنیم تا بیشترین بازده را تجربه کنید.
          </p>

          <button
            type="button"
            className="button button-outline button-small about-toggle"
            aria-expanded={open}
            aria-controls="about-more"
            onClick={() => setOpen((value) => !value)}
          >
            چطور کار می‌کنیم؟
            <ChevronIcon direction="down" className={`chevron ${open ? "is-open" : ""}`} />
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id="about-more"
                className="about-more"
                initial={reduced ? false : { height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={reduced ? undefined : { height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease }}
              >
                {/* Draft copy: review with the agency before launch. */}
                <p>
                  هر پروژه با شناخت برند و مخاطبش شروع می‌شود. ایده‌ها را پیش از
                  اجرا با شما مرور می‌کنیم و بعد از تأیید، تولید را آغاز می‌کنیم؛
                  از عکاسی و فیلم تا وب‌سایت و کمپین دیجیتال.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div ref={visualRef} className="about-visual">
          {/* Main photo: a gradient border whose light turns with the scroll. */}
          <motion.div
            className="about-frame"
            style={reduced ? undefined : ({ "--angle": borderAngle } as unknown as MotionStyle)}
            initial={reduced ? false : { clipPath: "inset(100% 0% 0% 0% round 32px)" }}
            animate={inView ? { clipPath: "inset(0% 0% 0% 0% round 32px)" } : undefined}
            transition={{ duration: 1.3, delay: 0.1, ease }}
          >
            <div className="duo about-main">
              <motion.div
                className="about-main-inner"
                style={reduced ? undefined : { y: imageY }}
                initial={reduced ? false : { scale: 1.3 }}
                animate={inView ? { scale: 1.12 } : undefined}
                transition={{ duration: 1.8, delay: 0.1, ease }}
              >
                <Image media={images.about} sizes="(max-width: 960px) 80vw, 480px" />
              </motion.div>
            </div>
          </motion.div>

          {/* Detail photo: smaller, deeper parallax, so the two images slide past each other. */}
          <motion.div className="about-detail-wrap" style={reduced ? undefined : { y: detailY }}>
            <motion.div
              className="duo about-detail"
              initial={reduced ? false : { opacity: 0, scale: 0.7, rotate: -14 }}
              animate={inView ? { opacity: 1, scale: 1, rotate: -5 } : undefined}
              transition={{ duration: 1.1, delay: 0.7, ease }}
            >
              <Image media={images.aboutDetail} sizes="240px" />
            </motion.div>
          </motion.div>

          <motion.div
            className="about-badge"
            aria-hidden="true"
            style={reduced ? undefined : { rotate: badgeRotate }}
            initial={reduced ? false : { opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.9, delay: 0.9, ease }}
          >
            <svg className="badge-text" viewBox="0 0 120 120">
              <defs>
                <path id="badge-circle" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" />
              </defs>
              {/* Centred on the path: right-to-left text anchored at the path's start would run off it. */}
              <text textAnchor="middle">
                <textPath href="#badge-circle" startOffset="50%">
                  ایده · طراحی · تولید · اجرا · روایت · اثر ·
                </textPath>
              </text>
            </svg>
            <OrbitGlyph className="badge-core" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
