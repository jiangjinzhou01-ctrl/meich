import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { PageHero, ContactCTA } from "@/components/ui";
import { CareersList } from "@/components/careers-list";
export const metadata: Metadata = pageMetadata(
  "加入我们",
  "了解美创数字倡导的工作方式与人才交流方向。正式招聘信息待确认。",
  "/careers/",
);
export default function Careers() {
  return (
    <>
      <PageHero
        label="一起创造"
        title={
          <>
            做有意义的事，
            <br />
            也把事情做好。
          </>
        }
        description="我们期待对文化、创意和数字技术保持好奇的人。带着你的专业与想法，一起讨论更好的工作方式。"
      />
      <div className="careers-banner container">
        <span>
          Build something
          <br />
          <i>meaningful.</i>
        </span>
        <div aria-hidden="true" className="culture-modules">
          <i />
          <i />
          <i />
        </div>
      </div>
      <section className="section container careers-culture">
        <h2>
          好的工作，
          <br />
          也需要好的方式。
        </h2>
        <div className="principles-grid">
          {[
            {
              title: "让专业被尊重",
              text: "观点可以不同，讨论要具体。用专业和事实推动判断。",
            },
            {
              title: "让沟通更直接",
              text: "及时反馈，坦诚表达。把理解建立在同一个问题上。",
            },
            {
              title: "让好奇心继续生长",
              text: "在真实问题中学习，让新的尝试有清晰的目标。",
            },
            {
              title: "让结果有意义",
              text: "关注工作的真实影响，把质量落实到每一个细节。",
            },
          ].map((c) => (
            <article key={c.title}>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="container careers-list">
        <CareersList />
      </section>
      <ContactCTA />
    </>
  );
}
