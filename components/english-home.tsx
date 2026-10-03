import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/content";
import { catalogFor } from "@/lib/source";
import { Button, SectionLabel, ContactCTA } from "./ui";
export function EnglishHome() {
  const work = catalogFor("/en/cases").filter((p) =>
    [
      "/en/cases/brochure-2026-liye-qin-slips",
      "/en/cases/brochure-2026-potala-snow-city",
    ].includes(p.path),
  );
  return (
    <div lang="en">
      <section className="hero container">
        <div className="hero-content">
          <SectionLabel>MGC DIGITAL · CULTURE × TECHNOLOGY</SectionLabel>
          <h1>
            Culture.
            <br />A new expression
            <br />
            with AI.
          </h1>
          <p>
            We connect cultural research, creative design and AI.
            <br />
            From exhibitions to museums and everyday cultural experiences.
          </p>
          <div className="hero-buttons">
            <Button href="/en/products/">Explore our capabilities</Button>
            <Button href="/en/contact/" secondary>
              Let’s talk
            </Button>
          </div>
        </div>
        <div className="hero-photograph">
          <div className="hero-photo-frame">
            <Image
              src={asset("/brand/liye.webp")}
              alt="Exhibition at Liye Qin Slips Museum, featuring MGC creative design and production"
              width={1080}
              height={659}
              priority
              sizes="(max-width: 800px) 90vw, 50vw"
            />
          </div>
          <div className="hero-photo-caption">
            <span>CULTURE × CREATIVE × AI</span>
            <Link href="/en/cases/brochure-2026-liye-qin-slips/">
              Liye Qin Slips Museum ↗
            </Link>
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <h2>Culture, made tangible.</h2>
          <Link className="text-link" href="/en/products/">
            All products & services ↗
          </Link>
        </div>
        <div className="english-areas">
          {[
            [
              "display",
              "Digital exhibitions",
              "Spatial storytelling, digital film and immersive interaction.",
            ],
            [
              "heritage",
              "Smart museums",
              "Connecting collections, visitors and museum services.",
            ],
            [
              "creative",
              "Cultural creation",
              "From cultural research and IP to products for everyday life.",
            ],
            [
              "operations",
              "Digital operations",
              "Cultural spaces, content and ongoing audience connections.",
            ],
          ].map(([id, title, text]) => (
            <Link href={`/en/products/areas/${id}/`} key={id}>
              <h3>{title} ↗</h3>
              <p>{text}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="container section">
        <div className="section-heading">
          <h2>Ideas, in experience.</h2>
          <Link className="text-link" href="/en/cases/">
            All projects ↗
          </Link>
        </div>
        <div className="project-grid">
          {work.map((p) => (
            <Link className="project-card" href={`${p.path}/`} key={p.path}>
              <div className="project-visual">
                <img
                  className="project-image"
                  src={p.image}
                  alt={p.title}
                  width={1440}
                  height={900}
                  loading="lazy"
                />
              </div>
              <div className="project-title">
                <h3>{p.title}</h3>
                <span aria-hidden="true">↗</span>
              </div>
              <p>{p.description}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="section container">
        <h2>Keep exploring.</h2>
        <nav className="english-explore" aria-label="Explore MGC">
          {[
            ["Experiences & tools", "/en/experiences/"],
            ["Innovation & research", "/en/research/"],
            ["Films", "/en/videos/"],
            ["Collaboration", "/en/collaboration/"],
            ["About MGC", "/en/about/"],
            ["Insights", "/en/insights/"],
          ].map(([t, h]) => (
            <Link key={h} href={h}>
              {t}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
      </section>
      <ContactCTA english />
    </div>
  );
}
