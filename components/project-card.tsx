import { projectEnglish } from "@/lib/english-content";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/content";
type Project = (typeof projects)[number];
import { languagePair } from "@/lib/routes";
import { ResponsiveImage } from "./responsive-image";
export const projectNames: Record<string, string> = {
  "liye-qin-slips": "Liye Qin Manuscript Museum",
  "potala-snow-city": "Potala Palace · Snow City",
  gaomiao: "Gaomiao Site Museum",
};
export function ProjectVisual({
  project: p,
  large = false,
}: {
  project: Project;
  large?: boolean;
}) {
  return (
    <div className="project-visual">
      <ResponsiveImage
        name={p.kind}
        alt={p.imageAlt}
        priority={large}
        sizes="100vw"
      />
    </div>
  );
}
export function ProjectCard({
  project: p,
  index = 0,
  english: en = false,
}: {
  project: Project;
  index?: number;
  english?: boolean;
}) {
  const href = en
    ? languagePair("/cases/" + p.slug + "/").en
    : "/cases/" + p.slug + "/";
  return (
    <Link
      href={href}
      prefetch={false}
      data-nav-tone="dark"
      data-scene={`${index + 1} / 03 · ${en ? projectNames[p.slug] : p.title}`}
      className={
        "project-card selected-project-" + index + " climate-" + p.kind
      }
    >
      <ProjectVisual project={p} />
      <div className="project-scrim" />
      <div className="project-film-copy">
        <div className="project-meta">
          <span>0{index + 1}</span>
          <span>{en ? "Selected work" : p.type}</span>
          <span>{p.year || ""}</span>
        </div>
        <h3>
          {en ? projectNames[p.slug] : p.title}
          <ArrowUpRight size={28} />
        </h3>
        <p>{en ? projectEnglish[p.slug].description : p.description}</p>
        <span className="project-role">
          {en
            ? "MGC / " + projectEnglish[p.slug].role
            : "美创职责 / " + p.service}
        </span>
      </div>
    </Link>
  );
}
