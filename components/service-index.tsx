"use client";
import { serviceEnglish } from "@/lib/english-content";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { services, asset } from "@/lib/content";
const images = ["gaomiao", "liye", "creative", "operations"];
const labels = [
  "Digital exhibitions",
  "Digital museums",
  "Cultural creation",
  "Digital operations",
];
export function ServiceIndex({ english: en = false }: { english?: boolean }) {
  const [active, setActive] = useState(0);
  const id = useId();
  useEffect(() => {
    const update = () => {
      const i = services.findIndex((s) => "#" + s.id === location.hash);
      if (i >= 0) setActive(i);
    };
    update();
    addEventListener("hashchange", update);
    return () => removeEventListener("hashchange", update);
  }, []);
  const s = services[active],
    pre = en ? "/en" : "";
  return (
    <section
      className="service-index"
      data-scene={en ? "Expertise" : "服务能力"}
      data-nav-tone="dark"
    >
      {images.map((im, i) => (
        <div
          key={im}
          className={"service-index-media " + (active === i ? "active" : "")}
        >
          <img
            src={asset("/brand/" + im + ".webp")}
            alt=""
            width={1920}
            height={1080}
            loading="lazy"
          />
        </div>
      ))}
      <div className="service-index-shade" />
      <div className="container service-index-body">
        <div
          className="service-index-list"
          role="tablist"
          aria-label={en ? "Business areas" : "业务领域"}
          aria-orientation="vertical"
        >
          {services.map((s, i) => (
            <button
              id={s.id}
              key={s.id}
              role="tab"
              aria-selected={active === i}
              aria-controls={id + "-panel"}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onPointerEnter={() => {
                if (matchMedia("(hover:hover)").matches) setActive(i);
              }}
              onKeyDown={(e) => {
                if (["ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) {
                  e.preventDefault();
                  const n =
                    e.key === "Home"
                      ? 0
                      : e.key === "End"
                        ? 3
                        : (i + (e.key === "ArrowDown" ? 1 : 3)) % 4;
                  setActive(n);
                  document.getElementById(services[n].id)?.focus();
                }
              }}
            >
              <small>{s.num}</small>
              <span>{en ? labels[i] : s.title}</span>
              <ArrowUpRight size={24} />
            </button>
          ))}
        </div>
        <div
          className="service-index-panel"
          role="tabpanel"
          id={id + "-panel"}
          aria-labelledby={s.id}
          tabIndex={0}
          key={active}
        >
          <span>{s.en}</span>
          <h2>{en ? labels[active] : s.title}</h2>
          <p>{en ? serviceEnglish[active].description : s.description}</p>
          <ul>
            {(en ? serviceEnglish[active].items : s.items).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="service-index-links">
            <Link
              href={pre + "/products/areas/" + s.id + "/"}
              className="scene-link"
            >
              {en ? "Explore this field" : "了解这一领域"}
              <ArrowUpRight size={18} />
            </Link>
            {active < 2 && (
              <Link
                className="scene-link"
                href={
                  en
                    ? "/en/cases/brochure-2026-liye-qin-slips/"
                    : "/cases/liye-qin-slips/"
                }
              >
                {en ? "Related project" : "相关项目"}
                <ArrowUpRight size={18} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
