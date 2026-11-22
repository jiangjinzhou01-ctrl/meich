import { ArrowUpRight } from "lucide-react";
import { address, asset, phone, phoneHref, projects } from "@/lib/content";
import { projectNames } from "@/lib/english-content";
import { caseCatalogFor } from "@/lib/source";
import { ContactForm } from "./contact-form";
import { CopyAddress } from "./copy-address";

export function ContactPage({ english: en = false }: { english?: boolean }) {
  const projectTitles = {
    ...Object.fromEntries(caseCatalogFor(en).map((item) => [item.path.split("/").pop()!, item.title])),
    ...Object.fromEntries(projects.map((project) => [project.slug, en ? projectNames[project.slug] : project.title])),
  };
  return (
    <div className="container correspondence">
      <div className="letter-address">
        <header>
          <p className="small-rule">{en ? "Project enquiries" : "项目咨询"}</p>
          <h1 className="section-display">{en ? "Contact MGC" : "联系美创"}</h1>
          <p>{en ? "Have a venue, an exhibition theme or a collection in mind? Call the studio or prepare a short project brief." : "有场地、展览主题或一批想展出的馆藏，都可以从一次通话聊起。也可以在这里整理项目需求。"}</p>
        </header>
        <section className="letter-phone">
          <h2>{en ? "Business enquiries" : "商务电话"}</h2>
          <a className="contact-phone" href={phoneHref}>{phone}<ArrowUpRight size={22}/></a>
        </section>
        <section className="studio-address">
          <img src={asset("/brand/reception-640.webp")} width={640} height={360} loading="lazy" alt={en ? "Reception at the Changsha office" : "美创数字长沙办公区入口"} />
          <div>
            <h2>{en ? "Changsha office" : "到访长沙"}</h2>
            <p>{en ? "Building 2, Meixi Lake International R&D Center, 76 Meixihu Road, Yuelu District, Changsha, Hunan" : address}</p>
            <div className="contact-visit-actions">
              <CopyAddress english={en} />
              <a className="text-link" href="https://uri.amap.com/search?keyword=%E6%B9%96%E5%8D%97%E7%BE%8E%E5%88%9B%E6%95%B0%E5%AD%97%E7%A7%91%E6%8A%80%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8&city=%E9%95%BF%E6%B2%99&view=map" target="_blank" rel="noreferrer">{en ? "Open Amap" : "打开地图"}<ArrowUpRight size={15}/></a>
            </div>
          </div>
        </section>
      </div>
      <ContactForm english={en} projectTitles={projectTitles} />
    </div>
  );
}
