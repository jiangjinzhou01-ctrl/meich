import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { PageHero, ContactCTA, Button } from "@/components/ui";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/content";
export const metadata: Metadata = pageMetadata(
  "项目案例",
  "美创数字精选项目：里耶古城（秦简）博物馆、布达拉宫雪城展览与高庙遗址博物馆。",
  "/work/",
);
export default function Work() {
  return (
    <>
      <PageHero
        label="精选项目"
        title={
          <>
            把思考，
            <br />
            变成看得见的体验。
          </>
        }
        description="从秦简故事到遗址文化，在不同空间中连接内容、创意与数字技术。"
      />
      <section className="container work-list">
        <div className="project-grid">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
        <p className="content-note">
          项目资料与图片选自美创现有官网，未添加未经确认的客户评价或成果指标。
        </p>
      </section>
      <section className="container source-related">
        <h2>探索完整案例库。</h2>
        <p>按场馆、文化主题、服务与技术方式查找更多美创作品。</p>
        <Button href="/cases/">进入全部案例</Button>
      </section>
      <ContactCTA />
    </>
  );
}
