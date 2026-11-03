import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { faNumber, metrics } from "../data/content";
import type { Metric } from "../data/content";
import { Reveal } from "./Shared";

function Counter({ metric }: { metric: Metric }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    if (reduced) {
      setCount(metric.value);
      return;
    }
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1600, 1);
      setCount(Math.round(metric.value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, reduced, metric.value]);
  return (
    <div
      ref={ref}
      className="stat"
      role="group"
      aria-label={`${faNumber(metric.value)}${metric.suffix} ${metric.label}`}
    >
      <strong aria-hidden="true" dir="ltr">
        {faNumber(count)}
        <span>{metric.suffix}</span>
      </strong>
      <span aria-hidden="true">{metric.label}</span>
    </div>
  );
}
export default function Statistics() {
  return (
    <section className="statistics container" aria-label="آمار نمایشی آژانس">
      <Reveal className="statistics-panel">
        <div className="statistics-heading">
          <span className="status-dot" />
          <span>به روایتِ عددها</span>
          <small>آمار نمونه و قابل جایگزینی</small>
        </div>
        <div className="stats-grid">
          {metrics.map((metric) => (
            <Counter key={metric.label} metric={metric} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
