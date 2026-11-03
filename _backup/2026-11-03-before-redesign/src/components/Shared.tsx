import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpLeft, Sparkles, X } from "lucide-react";
import { images } from "../data/content";
import type { Media } from "../data/content";

export function Image({
  media,
  className = "",
  eager = false,
}: {
  media: Media;
  className?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(0);
  return (
    <span className={`image-wrap ${className}`}>
      {failed < 2 ? (
        <img
          src={failed === 0 ? media.src : images.fallback}
          alt={media.alt}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding="async"
          style={{ objectPosition: media.position }}
          onError={() => setFailed((n) => n + 1)}
        />
      ) : (
        <span className="image-fallback" role="img" aria-label={media.alt}>
          تصویر موقت در دسترس نیست
        </span>
      )}
    </span>
  );
}
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow">
      <span aria-hidden="true" />
      {children}
    </p>
  );
}
export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a
      className={`brand ${footer ? "brand-footer" : ""}`}
      href="#home"
      aria-label="Criito؛ بازگشت به ابتدای صفحه"
    >
      <span className="brand-symbol" aria-hidden="true">
        <Sparkles strokeWidth={1.25} />
      </span>
      <span>
        <strong dir="ltr">Criito</strong>
        <small>آژانس خلاقیت و تبلیغات</small>
      </span>
    </a>
  );
}
export function Arrow({ className = "" }: { className?: string }) {
  return <ArrowUpLeft className={className} size={19} aria-hidden="true" />;
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
          className="icon-button dialog-close"
          onClick={onClose}
          aria-label="بستن پنجره"
        >
          <X size={22} />
        </button>
        {children}
      </div>
    </dialog>
  );
}
