import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { PageHero, ContactCTA, Button } from "@/components/ui";
import { services, asset } from "@/lib/content";
import Image from "next/image";
import { Process } from "@/components/process";
export const metadata: Metadata = pageMetadata(
  "服务能力",
  "数字展示、数字文博、数字文创与数字运营，连接文化研究、创意设计和数字技术。",
  "/services/",
);
export default function Services() {
  return (
    <>
      <PageHero
        label="我们的能力"
        title={
          <>
            让文化有表达，
            <br />
            让体验有深度。
          </>
        }
        description="从内容策划、空间设计到数字制作与运营，围绕文化场景建立完整服务。"
      />
      <section className="container service-details">
        {services.map((s) => (
          <article id={s.id} className="service-detail" key={s.id}>
            <div className="detail-index">{s.num}</div>
            <div className="detail-content">
              <h2>{s.title}</h2>
              <p>{s.description}</p>
              <div className="detail-items">
                {s.items.map((i) => (
                  <span key={i}>{i}</span>
                ))}
              </div>
            </div>
            <Image
              className="service-photo"
              src={asset(s.image)}
              alt={`美创${s.title}业务官方配图`}
              width={900}
              height={600}
              sizes="(max-width: 800px) 90vw, 40vw"
              loading="lazy"
            />
          </article>
        ))}
        <p className="content-note">
          服务内容依据美创现有官网整理。具体配置与交付范围，结合实际场景共同确定。
        </p>
      </section>
      <section className="container source-related">
        <h2>从具体产品，找到体验的起点。</h2>
        <p>查看产品用途、适用场景、技术配置与相关项目。</p>
        <Button href="/products/">浏览完整产品目录</Button>
      </section>
      <Process />
      <ContactCTA />
    </>
  );
}
