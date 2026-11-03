import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { faNumber, metrics } from "../data/content";
import type { Metric } from "../data/content";
import { MetricGlyph } from "./Icons";
import { ease } from "./Shared";

/**
 * Not rendered yet: the figures in `metrics` are placeholders from the mockup.
 * Replace them with real, sourced numbers, then enable <Statistics /> in App.tsx.
 */
function Counter({ metric }: { metric: Metric }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    if (reduced) {
      setCount(metric.value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1800, 1);
      setCount(Math.round(metric.value * (1 - Math.pow(1 - progress, 4))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, reduced, metric.value]);

  return (
    <div ref={ref} className="stat" role="group" aria-label={`${faNumber(metric.value)}${metric.suffix} ${metric.label}`}>
      <span className="stat-icon">
        <MetricGlyph name={metric.icon} />
      </span>
      <span className="stat-copy" aria-hidden="true">
        <strong>
          {faNumber(count)}
          {metric.suffix}
        </strong>
        <span>{metric.label}</span>
      </span>
    </div>
  );
}

export default function Statistics() {
  const reduced = useReducedMotion();
  return (
    <section className="container stats-section" aria-label="آمار آژانس">
      <motion.div
        className="stats-bar"
        initial={reduced ? false : { opacity: 0, y: 30, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease }}
      >
        {metrics.map((metric) => (
          <Counter key={metric.label} metric={metric} />
        ))}
      </motion.div>
    </section>
  );
}
