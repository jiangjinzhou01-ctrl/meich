import { PageHero } from "./ui";
import { CopyAddress } from "./copy-address";
import { ContactForm } from "./contact-form";
import { phone, phoneHref, address } from "@/lib/content";
export function ContactPage({ english: en = false }: { english?: boolean }) {
  return (
    <>
      <PageHero
        label={en ? "Contact" : "联系我们"}
        title={
          en ? (
            <>
              The next cultural experience.
              <br />
              Starts with a conversation.
            </>
          ) : (
            <>
              下一段文化体验，
              <br />
              从一次对话开始。
            </>
          )
        }
        description={
          en
            ? "Tell us about your context, your goals, or an idea taking shape. Explore the connection between culture, creativity and technology."
            : "告诉我们你的场景、目标，或一个还在萌芽的想法。一起寻找文化、创意与技术的结合方式。"
        }
      />
      <section className="container contact-layout">
        <aside data-reveal-group>
          <h2 data-reveal="editorial">{en ? "Start here." : "从这里开始。"}</h2>
          <div className="contact-directions">
            <span>{en ? "Projects" : "项目咨询"}</span>
            <span>{en ? "Collaboration" : "商务合作"}</span>
            <span>{en ? "Partnerships" : "合作伙伴"}</span>
            <span>{en ? "Careers" : "人才交流"}</span>
          </div>
          <div className="contact-info">
            <span>{en ? "Business enquiries" : "商务咨询"}</span>
            <a className="contact-phone" href={phoneHref}>
              {phone}
            </a>
            <span>{en ? "Visit" : "来访地址"}</span>
            <p data-reveal="content">
              {en
                ? "Building 2, Meixi Lake International R&D Center, 76 Meixihu Road, Yuelu District, Changsha, Hunan, China"
                : address}
            </p>
            <CopyAddress english={en} />
            <p data-reveal="content">
              {en
                ? "Please call ahead to arrange a visit."
                : "到访前欢迎电话预约，便于安排接待。"}
            </p>
            <a
              className="text-link"
              href="https://uri.amap.com/search?keyword=%E6%B9%96%E5%8D%97%E7%BE%8E%E5%88%9B%E6%95%B0%E5%AD%97%E7%A7%91%E6%8A%80%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8&city=%E9%95%BF%E6%B2%99&view=map"
              target="_blank"
              rel="noreferrer"
            >
              {en ? "Open Amap ↗" : "打开高德地图 ↗"}
            </a>
          </div>
        </aside>
        <ContactForm english={en} />
      </section>
    </>
  );
}
