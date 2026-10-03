import Link from "next/link";
import { PageHero, ContactCTA } from "@/components/ui";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Technology",
  "Cultural research, creative design, film production, 3D capture, interaction, software and system integration.",
  "/en/research/technology/",
);
export default function Page() {
  return (
    <div lang="en">
      <PageHero
        label="Technology"
        title={
          <>
            Individual capabilities.
            <br />A connected system.
          </>
        }
        description="Research, creative production and software meet in the delivery of cultural experiences."
        path="/en/research/technology/"
      />
      <section className="container section principles-grid">
        {[
          [
            "Cultural research",
            "Historical context, collections and narrative development.",
          ],
          ["Digital production", "Films, 3D resources and immersive imagery."],
          [
            "Interaction & software",
            "Visitor interfaces, museum platforms and guides.",
          ],
          [
            "System integration",
            "Displays, audio, sensing and on-site testing.",
          ],
        ].map(([t, d]) => (
          <article key={t}>
            <h2>{t}</h2>
            <p>{d}</p>
          </article>
        ))}
      </section>
      <section className="container source-related">
        <h2>Research and applications</h2>
        <Link href="/en/research/" className="text-link">
          Explore research ↗
        </Link>
      </section>
      <ContactCTA english />
    </div>
  );
}
