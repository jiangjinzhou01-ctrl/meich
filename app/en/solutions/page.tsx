import Link from "next/link";
import { PageHero, ContactCTA } from "@/components/ui";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Solutions",
  "Connected cultural content, spatial design and digital services for museums, exhibitions and cultural brands.",
  "/en/solutions/",
);
export default function Page() {
  return (
    <div lang="en">
      <PageHero
        label="Solutions"
        title={
          <>
            Each culture deserves
            <br />
            its own expression.
          </>
        }
        description="Start with the content and setting. Choose media, services and technology around the experience."
        path="/en/solutions/"
      />
      <section className="container section solution-en-list">
        {[
          [
            "Smart museums",
            "3D capture, collection resources, visitor guides and online exhibitions.",
            "/en/products/areas/heritage/",
          ],
          [
            "Cultural exhibitions",
            "Content planning, spatial design, film and interactive exhibits.",
            "/en/products/areas/display/",
          ],
          [
            "Cultural creation",
            "Cultural research, IP design, production and everyday objects.",
            "/en/products/areas/creative/",
          ],
          [
            "Content & operations",
            "Cultural spaces, film, social media and events.",
            "/en/products/areas/operations/",
          ],
        ].map(([t, d, h]) => (
          <article key={t}>
            <h2>{t}</h2>
            <p>{d}</p>
            <Link className="text-link" href={h}>
              Explore products ↗
            </Link>
          </article>
        ))}
      </section>
      <ContactCTA english />
    </div>
  );
}
