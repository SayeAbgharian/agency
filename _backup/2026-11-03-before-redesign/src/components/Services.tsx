import { useState } from "react";
import { services, faNumber } from "../data/content";
import { Arrow, Eyebrow, Image, Reveal } from "./Shared";

export default function Services() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <section
      id="services"
      className="section services"
      aria-labelledby="services-title"
    >
      <div className="container">
        <Reveal className="section-heading">
          <div>
            <Eyebrow>تخصص‌های ما</Eyebrow>
            <h2 id="services-title">
              یک فکر مشترک؛
              <br />
              <span className="gradient-text">هزار راه برای خلق.</span>
            </h2>
          </div>
          <p>
            از اولین ایده تا آخرین جزئیات،
            <br />
            تمام آنچه برند شما برای درخشیدن نیاز دارد.
          </p>
        </Reveal>
        <div className="services-mosaic">
          {services.map((service, index) => (
            <Reveal
              key={service.id}
              className={`service-slot service-slot-${index + 1}`}
              delay={(index % 3) * 0.06}
            >
              <button
                className={`service-card ${expanded === service.id ? "is-expanded" : ""}`}
                aria-expanded={expanded === service.id}
                aria-controls={`service-${service.id}`}
                onClick={() =>
                  setExpanded(expanded === service.id ? null : service.id)
                }
              >
                <Image media={service.image} />
                <span className="service-shade" />
                <span className="service-index">
                  / {faNumber(index + 1).padStart(2, "۰")}
                </span>
                <span className="service-arrow">
                  <Arrow />
                </span>
                <span className="service-content">
                  <span className="service-category">{service.category}</span>
                  <strong>{service.title}</strong>
                  <span
                    className="service-description"
                    id={`service-${service.id}`}
                  >
                    {service.description}
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
        <p className="services-hint">
          برای آشنایی بیشتر، هر تخصص را انتخاب کنید.
          <span>یک تیم یکپارچه، از استراتژی تا اجرا.</span>
        </p>
      </div>
    </section>
  );
}
