import { Navigate, useParams } from "react-router-dom";

import { services } from "../data/content";
import DetailPage from "./DetailPage";

/** One page per service, reached from the homepage cards. Content comes from data/content.ts. */
export default function ServicePage() {
  const { id } = useParams();
  const service = services.find((item) => item.id === id);
  if (!service) return <Navigate to="/" replace />;

  return (
    <DetailPage
      back={{ to: "/#services", label: "همه خدمات" }}
      media={service.image}
      title={
        <>
          {service.title}
          {service.latin && " "}
          {service.latin && (
            <span lang="en" dir="ltr" className="service-latin">
              ({service.latin})
            </span>
          )}
        </>
      }
      consultLabel="مشاوره درباره این خدمت"
      consultServiceId={service.id}
      othersTitle="خدمات دیگر"
      others={services
        .filter((item) => item.id !== service.id)
        .map((item) => ({ to: `/services/${item.id}`, label: item.title }))}
    >
      <p>{service.description}</p>
    </DetailPage>
  );
}
