import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { CopyAddress } from "@/components/copy-address";
import { ContactForm } from "@/components/contact-form";
import { phone, phoneHref, address } from "@/lib/content";
export const metadata: Metadata = pageMetadata(
  "联系我们",
  "与美创数字讨论文化展示、智慧文博、文创开发与合作需求。商务咨询：0731-89728572。",
  "/contact/",
);
export default function Contact() {
  return (
    <>
      <PageHero
        label="联系我们"
        title={
          <>
            下一段文化体验，
            <br />
            从一次对话开始。
          </>
        }
        description="告诉我们你的场景、目标，或一个还在萌芽的想法。一起寻找文化、创意与技术的结合方式。"
      />
      <section className="container contact-layout">
        <aside>
          <h2>从这里开始。</h2>
          <div className="contact-directions">
            <span>项目咨询</span>
            <span>商务合作</span>
            <span>合作伙伴</span>
            <span>人才交流</span>
          </div>
          <div className="contact-info">
            <span>商务咨询</span>
            <a className="contact-phone" href={phoneHref}>
              {phone}
            </a>
            <span>来访地址</span>
            <p>{address}</p>
            <CopyAddress />
            <p>到访前欢迎电话预约，便于安排接待。</p>
            <a
              className="text-link"
              href="https://uri.amap.com/search?keyword=%E6%B9%96%E5%8D%97%E7%BE%8E%E5%88%9B%E6%95%B0%E5%AD%97%E7%A7%91%E6%8A%80%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8&city=%E9%95%BF%E6%B2%99&view=map"
              target="_blank"
              rel="noreferrer"
            >
              打开高德地图 ↗
            </a>
          </div>
        </aside>
        <ContactForm />
      </section>
    </>
  );
}
