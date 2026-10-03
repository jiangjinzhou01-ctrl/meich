import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Image from "next/image";
import { asset } from "@/lib/content";
import { PageHero, ContactCTA } from "@/components/ui";
import { TechnologySystem } from "@/components/technology-system";
export const metadata: Metadata = pageMetadata(
  "技术能力",
  "连接文化研究、创意设计、数字生产与智慧软件，了解美创的研发与技术能力。",
  "/technology/",
);
export default function Technology() {
  return (
    <>
      <PageHero
        label="技术体系"
        title={
          <>
            单项能力，
            <br />
            连接成系统。
          </>
        }
        description="文化研究、创意设计、数字生产与智慧软件共同工作。选择一个节点，了解它如何参与文化体验。"
      />
      <section className="container tech-section">
        <TechnologySystem />
      </section>
      <section className="container section technology-products">
        <h2>让技术，回应真实场景。</h2>
        <div className="technology-product-grid">
          {[
            {
              title: "沉浸式数字影院",
              image: "/brand/immersive-cinema.webp",
              text: "组合多面显示、声场与同步播放，让文化故事在观看空间中展开。",
            },
            {
              title: "AI 文化主题拍照",
              image: "/brand/ai-photo.webp",
              text: "结合文化主题、个性化影像与交互，让观众参与内容表达。",
            },
          ].map((p) => (
            <article key={p.title}>
              <Image
                src={asset(p.image)}
                alt={`美创官网公开产品：${p.title}`}
                width={1000}
                height={700}
                sizes="(max-width: 600px) 90vw, 45vw"
                loading="lazy"
              />
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="container section quality-section">
        <h2>可靠，来自每一个环节。</h2>
        <div className="quality-grid">
          {[
            {
              title: "清晰的结构",
              text: "让文化内容、技术系统与使用场景相互连接。",
            },
            {
              title: "必要的验证",
              text: "从内容审核到现场联调，关注关键体验与运行质量。",
            },
            {
              title: "持续的维护",
              text: "把内容更新、设备运行与后续运营一起考虑。",
            },
          ].map((q) => (
            <div key={q.title}>
              <h3>{q.title}</h3>
              <p>{q.text}</p>
            </div>
          ))}
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
