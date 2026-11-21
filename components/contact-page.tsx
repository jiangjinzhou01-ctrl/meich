import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { address, phone, phoneHref, projects } from "@/lib/content";
import { projectNames } from "@/lib/english-content";
import { caseCatalogFor } from "@/lib/source";
import { ContactForm } from "./contact-form";
import { CopyAddress } from "./copy-address";
import { PageHero } from "./ui";

export function ContactPage({ english: en = false }: { english?: boolean }) {
  const projectTitles = {
    ...Object.fromEntries(caseCatalogFor(en).map((item) => [item.path.split("/").pop()!, item.title])),
    ...Object.fromEntries(projects.map((project) => [
      project.slug, en ? projectNames[project.slug] : project.title,
    ])),
  };
  return (
    <>
      <PageHero
        path={en ? "/en/contact/" : "/contact/"}
        label=""
        title={en ? "Discuss a project" : "项目咨询"}
        description={en
          ? "Tell us the venue, the audience and what you want to make. A brief outline is enough to start."
          : "可以从场地、观众和想做的事聊起。已有展览主题或馆藏资料，也可以一起说说。"}
      />
      <section className="container contact-layout editorial-contact">
        <div className="contact-call">
          <h2><Phone size={18} aria-hidden="true" />{en ? "Business enquiries" : "商务电话"}</h2>
          <a href={phoneHref} className="contact-phone">{phone}</a>
        </div>
        <ContactForm english={en} projectTitles={projectTitles} />
        <div className="contact-visit">
          <h2><MapPin size={19} aria-hidden="true" />{en ? "Visit our Changsha office" : "长沙办公地址"}</h2>
          <p>
            {en ? "Building 2, Meixi Lake International R&D Center, 76 Meixihu Road, Yuelu District, Changsha, Hunan" : address}
          </p>
          <div className="contact-visit-actions">
            <CopyAddress english={en} />
            <a
              className="text-link"
              href="https://uri.amap.com/search?keyword=%E6%B9%96%E5%8D%97%E7%BE%8E%E5%88%9B%E6%95%B0%E5%AD%97%E7%A7%91%E6%8A%80%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8&city=%E9%95%BF%E6%B2%99&view=map"
              target="_blank"
              rel="noreferrer"
            >
              {en ? "Open Amap" : "打开高德地图"}<ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
