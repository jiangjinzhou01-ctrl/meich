import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/content";
import { projectEnglish, projectNames } from "@/lib/english-content";
import { languagePair } from "@/lib/routes";
import { ResponsiveImage } from "./responsive-image";

type Project = (typeof projects)[number];

export function ProjectCard({
  project,
  english: en = false,
}: {
  project: Project;
  english?: boolean;
}) {
  const pair = languagePair("/cases/" + project.slug + "/");
  const title = en ? projectNames[project.slug] : project.title;
  const photo = project.kind === "liye" ? "liye-cinema" : project.kind === "potala" ? "potala-gallery" : project.kind;
  const alt = project.kind === "liye"
    ? en ? "The museum’s immersive cinema" : "里耶古城（秦简）博物馆碗幕影院"
    : project.kind === "potala"
      ? en ? "Inside the Snow City exhibition" : "布达拉宫雪城展陈现场"
      : en ? "Gaomiao Site Museum entrance" : project.imageAlt;
  return (
    <Link className="editorial-project-card" href={en ? pair.en : pair.zh} prefetch={false}>
      <div className="editorial-project-photo">
        <ResponsiveImage name={photo} alt={alt} sizes="(max-width: 700px) 92vw, 31vw" />
      </div>
      <div className="editorial-project-line">
        <div>
          <p>{en ? projectEnglish[project.slug].role : project.service}</p>
          <h3>{title}</h3>
        </div>
        <ArrowUpRight size={21} aria-hidden="true" />
      </div>
    </Link>
  );
}
