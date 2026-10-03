import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, ContactCTA, Button } from "@/components/ui";
import { SourceContent } from "@/components/source-content";
import { getSourcePage } from "@/lib/source";
import { company, asset } from "@/lib/content";
export const metadata: Metadata = pageMetadata(
  "关于美创",
  "湖南美创数字科技有限公司，专注文化与科技融合，以创意设计、数字生产与智慧软件连接文化体验。",
  "/about/",
);
export default function About() {
  const source = getSourcePage("/about");
  return (
    <>
      <PageHero
        label="关于美创数字"
        title={
          <>
            以文化为起点，
            <br />
            让创造走得更远。
          </>
        }
        description={`${company}（MGC美创数字），专注文化与科技融合。立足长沙，服务文博、文旅与文创领域。`}
      />
      <figure className="container company-photo" data-reveal="scale">
        <Image
          src={asset("/brand/reception.webp")}
          alt="美创数字真实办公空间：接待前厅与官方品牌标识"
          width={1600}
          height={900}
          sizes="90vw"
          priority
        />
        <figcaption>MGC 美创数字 · 长沙办公空间</figcaption>
      </figure>
      <section className="about-manifesto container">
        <span className="about-word" aria-hidden="true">
          Culture
          <br />
          <i>in experience.</i>
        </span>
        <div>
          <h2>创造，有文化的根。</h2>
          <p>
            美创的行业探索始于2008年，湖南美创数字科技有限公司于2015年2月9日正式成立。文化研究、内容策划、空间设计、数字多媒体与软件开发，在同一个项目中相互连接。
          </p>
          <p>
            从一件文物到一段历史，从一个空间到日常之物，我们希望让文化被理解，也让体验留下记忆。
          </p>
        </div>
      </section>
      <section className="section about-principles">
        <div className="container">
          <h2>
            不同的能力，
            <br />
            共同完成一段体验。
          </h2>
          <div className="principles-grid">
            {[
              {
                title: "创意设计",
                text: "理解文化内容，建立展陈叙事，连接空间、视觉与观众。",
              },
              {
                title: "数字生产",
                text: "把内容转化为数字影像、三维资源与互动体验，完成从想法到呈现的制作。",
              },
              {
                title: "智慧软件",
                text: "以平台与服务连接文物、场馆与观众，让文化资源在数字世界延伸。",
              },
              {
                title: "跨专业共创",
                text: "让文化研究、创意和技术共同面对问题，以 AI 支撑新的文化场景研发探索。",
              },
            ].map((v) => (
              <article key={v.title} data-reveal="line">
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section container about-culture">
        <div>
          <h2>
            在真实的场景里，
            <br />
            继续学习与创造。
          </h2>
          <Image
            className="studio-photo"
            src={asset("/brand/studio.webp")}
            alt="美创数字真实开放式办公区"
            width={1280}
            height={861}
            sizes="(max-width: 800px) 90vw, 45vw"
            loading="lazy"
          />
        </div>
        <div>
          <p>
            以AI为支撑，连接创意设计、数字生产与智慧软件。线上数字博物馆、文化场景数字孪生与多模态虚实交互，是美创持续探索的方向。
          </p>
          <p className="about-research-note">
            尊重内容的来处，关注技术的适用性，在开放协作中找到新的表达。
          </p>
          <Button href="/research/technology/" secondary>
            了解研发与能力
          </Button>
        </div>
      </section>
      {source && (
        <section className="container company-archive" id="profile">
          <details>
            <summary>进一步了解美创：创始人、专家团队、资质与荣誉</summary>
            <SourceContent page={source} excludeIds={["profile"]} />
          </details>
        </section>
      )}
      <ContactCTA />
    </>
  );
}
