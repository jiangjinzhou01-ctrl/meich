import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/content";
import { projectEnglish, projectNames } from "@/lib/english-content";
import { languagePair } from "@/lib/routes";
import { ResponsiveImage } from "./responsive-image";

export function ProjectCard({ project, english: en = false }: { project: (typeof projects)[number]; english?: boolean }) {
  const pair = languagePair("/cases/" + project.slug);
  const potala = project.kind === "potala";
  const alt = potala ? (en ? "Interior of the Snow City exhibition at the Potala Palace" : "布达拉宫雪城室内展陈") : (en ? "Entrance to the Gaomiao exhibition" : project.imageAlt);
  return (
    <Link className={"programme-project card-" + project.kind} href={en ? pair.en : pair.zh}>
      <ResponsiveImage name={potala ? "potala-gallery" : project.kind} alt={alt}
        sizes={potala ? "(max-width: 700px) 83vw, 34vw" : "(max-width: 700px) 92vw, 57vw"} />
      <div className="programme-project-meta"><span>{en ? projectEnglish[project.slug].role : project.service}</span>{project.year && <time>{project.year}</time>}</div>
      <div className="programme-project-title"><h3>{en ? projectNames[project.slug] : project.title}</h3><ArrowUpRight size={22} /></div>
    </Link>
  );
}
