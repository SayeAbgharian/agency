import { Quote } from "lucide-react";
import { testimonials } from "../data/content";
import { Eyebrow, Image, Reveal } from "./Shared";

export default function Testimonials() {
  return (
    <section
      className="section testimonials"
      aria-labelledby="testimonials-title"
    >
      <div className="container">
        <Reveal className="testimonial-heading">
          <Eyebrow>از زبانِ همراهان</Eyebrow>
          <h2 id="testimonials-title">
            اعتماد، زیباترین
            <br />
            <span className="gradient-text">نتیجه‌ی همکاری‌ست.</span>
          </h2>
          <p>سه روایت فرضی برای نمایش تجربه‌ی همکاری</p>
        </Reveal>
        <div className="testimonials-grid">
          {testimonials.map((item, index) => (
            <Reveal
              key={item.name}
              className={`testimonial testimonial-${index}`}
              delay={index * 0.07}
            >
              <Quote
                className="quote-icon"
                size={32}
                strokeWidth={1.2}
                aria-hidden="true"
              />
              <blockquote>{item.quote}</blockquote>
              <div className="testimonial-author">
                <Image media={item.image} />
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.role}</small>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
