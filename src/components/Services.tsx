import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

import { services } from "../data/content";
import { ChevronIcon } from "./Icons";
import { Image, NeonFrame, SectionTitle, ease } from "./Shared";

export default function Services() {
  const reduced = useReducedMotion();

  return (
    <section id="services" className="section services" aria-labelledby="services-title">
      <div className="container">
        <SectionTitle id="services-title" title="خدمات ما" />

        <ul className="services-grid">
          {services.map((service, i) => (
            <motion.li
              key={service.id}
              className="service-slot"
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease }}
            >
              {/* Bento grid (global.css): wide, tall and square cards fit together like a puzzle.
                  The photo carries the title; hover or focus dims it and lifts the full description in from below. */}
              <Link to={`/services/${service.id}`} className="service-card">
                <Image
                  media={service.image}
                  className="service-image"
                  sizes="(max-width: 640px) 100vw, (max-width: 1040px) 50vw, 640px"
                />
                <span className="temp-label service-temp">تصویر موقت</span>
                <span className="service-content">
                  <span className="service-title">
                    {service.title}
                    {service.latin && " "}
                    {service.latin && (
                      <span lang="en" dir="ltr" className="service-latin">
                        ({service.latin})
                      </span>
                    )}
                  </span>
                  <span className="service-more">
                    <span className="service-more-inner">
                      <span className="service-description">{service.description}</span>
                      <span className="service-link">
                        مشاهده خدمت
                        <ChevronIcon direction="left" />
                      </span>
                    </span>
                  </span>
                </span>
              </Link>
              <NeonFrame radius={20} className="is-hover" />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
