import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { asset, projects, services } from "@/lib/content";
import { serviceEnglish } from "@/lib/english-content";
import { languagePair } from "@/lib/routes";
import { ExhibitionCover } from "./exhibition-cover";
import { ProjectCard } from "./project-card";
import { ContactCTA } from "./ui";

export function HomePage({ english: en = false }: { english?: boolean }) {
  const prefix = en ? "/en" : "";
  const liye = languagePair("/cases/liye-qin-slips/")[en ? "en" : "zh"];
  return (
    <div className="programme" lang={en ? "en" : "zh-CN"}>
      <ExhibitionCover english={en} />
      <section className="container gallery-programme" id="selected-work">
        <div className="programme-heading">
          <h2>{en ? "Exhibition spaces" : "展览现场"}</h2>
          <Link className="folio-link" href={prefix + "/cases/"}>{en ? "Project index" : "全部案例"}<ArrowUpRight size={19} /></Link>
        </div>
        <div className="gallery-pair">
          <ProjectCard project={projects[2]} english={en} />
          <ProjectCard project={projects[1]} english={en} />
        </div>
      </section>

      <section className="workshop-spread">
        <div className="container workshop-layout">
          <figure className="workshop-photo">
            <img src={asset("/brand/liye-bench.webp")} width={1080} height={810} loading="lazy" alt={en ? "Checking the angle and illumination of a Liye manuscript display" : "里耶展柜调试现场，工作人员在灯光下比对简牍的观看角度"} />
            <figcaption>{en ? "Liye · Adjusting a manuscript display" : "里耶现场 · 简牍陈列调试"}</figcaption>
          </figure>
          <div className="workshop-text">
            <p className="small-rule">{en ? "From the workshop" : "制作手记"}</p>
            <h2>{en ? <>How do you read<br />a Qin slip?</> : <>一枚秦简，<br />怎样读清？</>}</h2>
            <p>{en ? "Start at the display case. Test the viewing angle, adjust the mount, then set the original alongside a transcription and notes on the words." : "先到展柜前，试角度、调托台。再把简牍原貌、现代转写和重点词语并置，让观众看清字形，也读懂简文。"}</p>
            <Link className="folio-link" href={liye + "#case-chapter-1"}>{en ? "Read the Liye project" : "翻阅里耶项目手记"}<ArrowUpRight size={19} /></Link>
          </div>
          <figure className="workshop-inset">
            <img src={asset("/brand/liye-details-640.webp")} width={640} height={453} loading="lazy" alt={en ? "Original manuscript, transcription and interpretation" : "简牍实物、现代文字转写与重点释义版面"} />
            <figcaption>{en ? "Detail · Interpretation panel" : "图版局部 · 秦简释读"}</figcaption>
          </figure>
        </div>
      </section>

      <section className="container practice-index">
        <div className="practice-heading"><h2>{en ? "Studio practice" : "美创的工作"}</h2>
          <p>{en ? "From planning a space to looking after its digital life." : "从展馆的内容策划与空间设计，一路做到落地制作和开馆后的运营。"}</p>
          <Link className="folio-link" href={prefix + "/research/"}>{en ? "Explore our research" : "了解技术研发"}<ArrowRight size={17} /></Link>
        </div>
        <div className="practice-entries">
          {services.map((service, i) => <Link key={service.id} href={prefix + "/services/#" + service.id}>
            <strong>{en ? service.enTitle : service.title}</strong><span>{en ? serviceEnglish[i].items[0] : service.items[0]}</span><ArrowUpRight size={21} />
          </Link>)}
        </div>
      </section>
      <ContactCTA english={en} />
    </div>
  );
}
