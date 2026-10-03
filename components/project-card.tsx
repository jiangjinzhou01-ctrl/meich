import Link from "next/link";
import Image from "next/image";
import { projects, asset } from "@/lib/content";
type Project = (typeof projects)[number];
export function ProjectVisual({
  project,
  large = false,
}: {
  project: Project;
  large?: boolean;
}) {
  return (
    <div
      className={`project-visual project-${project.kind} ${large ? "large" : ""}`}
    >
      <Image
        src={asset(project.image)}
        alt={project.imageAlt}
        width={1440}
        height={900}
        sizes={
          large
            ? "(max-width: 1440px) 90vw, 1440px"
            : "(max-width: 600px) 100vw, 50vw"
        }
        className="project-image"
        loading={large ? "eager" : "lazy"}
      />
    </div>
  );
}
export function ProjectCard({ project }: { project: Project; index?: number }) {
  return (
    <Link
      href={`/work/${project.slug}/`}
      className="project-card"
      data-reveal="scale"
    >
      <ProjectVisual project={project} />
      <div className="project-meta">
        <span>
          {project.type}
          {project.year ? ` · ${project.year}` : ""}
        </span>
      </div>
      <div className="project-title">
        <h3>{project.title}</h3>
        <span className="project-arrow" aria-hidden="true">
          ↗
        </span>
      </div>
      <p>{project.service}</p>
    </Link>
  );
}
