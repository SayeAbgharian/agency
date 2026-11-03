import { Link, Navigate, useParams } from "react-router-dom";

import { projects, services } from "../data/content";
import DetailPage from "./DetailPage";

/** One page per portfolio project, reached from the homepage panels. Content comes from data/content.ts. */
export default function ProjectPage() {
  const { id } = useParams();
  const project = projects.find((item) => item.id === id);
  if (!project) return <Navigate to="/" replace />;

  const service = services.find((item) => item.id === project.service);

  return (
    <DetailPage
      back={{ to: "/#portfolio", label: "همه نمونه‌کارها" }}
      media={project.image}
      title={project.category}
      consultLabel="پروژه‌ای مشابه دارید؟ مشاوره بگیرید"
      consultServiceId={project.service}
      related={
        service && (
          <Link to={`/services/${service.id}`} className="text-button">
            خدمت مرتبط: {service.title}
          </Link>
        )
      }
      othersTitle="نمونه‌کارهای دیگر"
      others={projects
        .filter((item) => item.id !== project.id)
        .map((item) => ({ to: `/projects/${item.id}`, label: item.category }))}
    >
      {/* Shows a visible placeholder until the project's real write-up is added in data/content.ts. */}
      <p>{project.description ?? "شرح کامل این پروژه به‌زودی در همین صفحه قرار می‌گیرد."}</p>
    </DetailPage>
  );
}
