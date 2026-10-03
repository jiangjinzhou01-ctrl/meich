import Link from "next/link";
import { services } from "@/lib/content";
import { ServiceGraphic } from "./digital-system";
export function ServiceCard({
  service,
}: {
  service: (typeof services)[number];
}) {
  return (
    <Link
      href={`/services/#${service.id}`}
      className={`service-card service-${service.visual}`}
      data-reveal="mask"
    >
      <div className="service-top">
        <span aria-hidden="true">↗</span>
      </div>
      <ServiceGraphic kind={service.visual} />
      <div className="service-copy">
        <h3>{service.title}</h3>
        <p>{service.description}</p>
      </div>
    </Link>
  );
}
