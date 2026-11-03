import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { ArrowDown, ArrowLeft } from "lucide-react";
import { images } from "../data/content";
import { Arrow, Eyebrow, Image } from "./Shared";

export default function Hero({ onConsult }: { onConsult: () => void }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 70, damping: 25 }),
    springY = useSpring(y, { stiffness: 70, damping: 25 });
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero-glow" aria-hidden="true" />
      <div className="aurora" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="stars" aria-hidden="true">
        {Array.from({ length: 28 }, (_, n) => (
          <i
            key={n}
            style={{
              left: `${(n * 37) % 100}%`,
              top: `${(n * 53) % 90}%`,
              animationDelay: `${(n % 7) * 0.6}s`,
              animationDuration: `${3 + (n % 5)}s`,
            }}
          />
        ))}
      </div>
      <div className="container hero-layout">
        <motion.div
          className="hero-copy"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          <Eyebrow>ایده‌های جسورانه، اثرهای ماندگار</Eyebrow>
          <h1 id="hero-title">
            <span className="headline-small">
              <bdi dir="ltr" className="neon-name">Criito</bdi> · آژانس تبلیغاتی
            </span>خلاقیت،
            <br />
            <span className="gradient-text">فراتر از تبلیغات.</span>
          </h1>
          <p className="hero-description">
            از ایده تا اجرا، در کنار شما هستیم تا برندتان را به سطحی بالاتر
            برسانیم. اینجا، نقطه آغازِ متفاوت دیده‌شدن است.
          </p>
          <div className="button-row">
            <button className="button button-primary" onClick={onConsult}>
              درخواست مشاوره رایگان
              <Arrow />
            </button>
            <a href="#portfolio" className="button button-ghost">
              مشاهده نمونه‌کارها
              <ArrowLeft size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="hero-note">
            <span className="status-dot" aria-hidden="true" />
            <span>برای ایده‌ی بعدی شما آماده‌ایم</span>
            <span className="note-line" />
          </div>
        </motion.div>
        <motion.div
          className="hero-visual"
          initial={reduced ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.25 }}
          onPointerMove={(event) => {
            if (reduced || event.pointerType !== "mouse") return;
            const bounds = event.currentTarget.getBoundingClientRect();
            x.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 14);
            y.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 14);
          }}
          onPointerLeave={() => {
            x.set(0);
            y.set(0);
          }}
        >
          <div className="hero-orbit" aria-hidden="true" />
          <div className="ring ring-a" aria-hidden="true" />
          <div className="ring ring-b" aria-hidden="true" />
          <span className="float-chip chip-1" aria-hidden="true">
            <b dir="ltr">C·R·I·I·T·O</b>
          </span>
          <span className="float-chip chip-2" aria-hidden="true">
            ایده <em>+</em> اثر
          </span>
          <motion.div className="hero-image" style={{ x: springX, y: springY }}>
            <Image media={images.hero} eager />
            <div className="hero-image-shade" />
          </motion.div>
          <div className="visual-caption">
            <span className="caption-number">۰۱ /</span>
            <span>
              هر برند،
              <br />
              <strong>یک جهانِ تازه.</strong>
            </span>
            <Arrow />
          </div>
          <span className="visual-side-note">استراتژی · خلاقیت · تجربه</span>
          <span className="visual-spark" aria-hidden="true">
            ✦
          </span>
        </motion.div>
      </div>
      <div className="container hero-bottom">
        <a href="#about" className="scroll-hint">
          <span className="scroll-icon">
            <ArrowDown size={15} />
          </span>
          کمی پایین‌تر؛ بیشتر آشنا شویم
        </a>
        <span className="hero-bottom-label">از یک جرقه، تا یک اتفاق بزرگ</span>
      </div>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <div key={k} className="marquee-group">
              {[
                "Creative · خلاقیت",
                "Reaching · در دسترس",
                "Idea · ایده",
                "Impact · اثرگذاری",
                "Trust · اعتماد",
                "Original · اصیل",
              ].map((t) => (
                <span key={t}>
                  {t}
                  <i>✦</i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
