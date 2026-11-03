import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { projects, faNumber } from "../data/content";
import type { Project } from "../data/content";
import { Arrow, Dialog, Eyebrow, Image, Reveal } from "./Shared";

export default function Portfolio({ onConsult }: { onConsult: () => void }) {
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  return (
    <section
      id="portfolio"
      className="section portfolio"
      aria-labelledby="portfolio-title"
    >
      <div className="container">
        <Reveal className="section-heading">
          <div>
            <Eyebrow>گالریِ ایده‌ها</Eyebrow>
            <h2 id="portfolio-title">
              حرف کمتر.
              <br />
              <span className="gradient-text">اثر بیشتر.</span>
            </h2>
          </div>
          <div className="portfolio-intro">
            <p>چند قاب از آنچه می‌توان خلق کرد.</p>
            <span className="demo-tag">پروژه‌های مفهومی و نمایشی</span>
          </div>
        </Reveal>
        <div className="portfolio-grid">
          <AnimatePresence initial={false}>
            {projects
              .slice(0, showAll ? projects.length : 3)
              .map((project, index) => (
                <motion.article
                  key={project.id}
                  className={`project project-${index + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <button
                    className="project-button"
                    onClick={() => setSelected(project)}
                    aria-label={`جزئیات پروژه مفهومی ${project.title}`}
                  >
                    <span className="project-image">
                      <Image media={project.image} />
                      <span className="project-overlay">
                        <span>
                          نگاهی به پروژه
                          <Arrow />
                        </span>
                      </span>
                      <span className="project-number">
                        {faNumber(index + 1).padStart(2, "۰")}
                      </span>
                    </span>
                    <span className="project-info">
                      <span>
                        <small>{project.category}</small>
                        <strong>{project.title}</strong>
                      </span>
                      <span className="round-arrow">
                        <Arrow />
                      </span>
                    </span>
                    <span className="project-description">
                      {project.description}
                    </span>
                  </button>
                </motion.article>
              ))}
          </AnimatePresence>
        </div>
        <div className="portfolio-bottom">
          <p>این گالری نمونه است و به مشتری واقعی نسبت داده نمی‌شود.</p>
          <button
            className="button button-outline"
            aria-expanded={showAll}
            onClick={() => setShowAll((all) => !all)}
          >
            {showAll ? "نمایش گزیده پروژه‌ها" : "مشاهده همه نمونه‌کارها"}
            <ArrowLeft size={18} />
          </button>
        </div>
      </div>
      {selected && (
        <Dialog
          title={`پروژه مفهومی ${selected.title}`}
          onClose={() => setSelected(null)}
          className="project-dialog"
        >
          <Image
            media={selected.image}
            className="dialog-project-image"
            eager
          />
          <span className="demo-tag">پروژه مفهومی؛ نه سفارش مشتری واقعی</span>
          <h2>{selected.title}</h2>
          <p className="mini-label">{selected.category}</p>
          <p>{selected.description}</p>
          <button
            className="button button-primary"
            onClick={() => {
              setSelected(null);
              onConsult();
            }}
          >
            برای برند من هم خلق کنید
            <Arrow />
          </button>
        </Dialog>
      )}
    </section>
  );
}
