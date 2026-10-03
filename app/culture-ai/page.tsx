import { PageHero, ContactCTA } from "@/components/ui";
import { CultureLab } from "@/components/culture-lab";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Culture × AI",
  "从里耶秦简出发，体验识别、解读、表达与空间化的文化转化过程。预置概念演示，无实时 AI 接口。",
  "/culture-ai/",
);
export default function Page() {
  return (
    <>
      <PageHero
        label="Culture × AI"
        title={
          <>
            文化的深度，
            <br />
            AI 的新表达。
          </>
        }
        description="从里耶秦简出发，体验识别、解读、表达与空间化。文化知识需要校对，生成表达标明来处。"
      />
      <CultureLab standalone />
      <section className="container section lab-principles">
        <h2>让新的表达，有可靠的来处。</h2>
        <div className="principles-grid">
          <article>
            <h3>内容有依据</h3>
            <p>历史与文物知识从资料出发，经过文化内容校对，再进入互动体验。</p>
          </article>
          <article>
            <h3>体验有边界</h3>
            <p>明确生成内容、项目应用与研发探索，按具体场景验证使用方式。</p>
          </article>
          <article>
            <h3>技术有评估</h3>
            <p>把生成质量、响应时间、成本和个人影像处理一起纳入项目评估。</p>
          </article>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
