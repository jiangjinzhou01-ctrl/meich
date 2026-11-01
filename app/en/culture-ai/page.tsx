import { PageHero, ContactCTA } from "@/components/ui";
import { CultureLab } from "@/components/culture-lab";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Culture × AI",
  "Explore the Liye manuscripts through recognition, interpretation, expression and space. A curated concept without a live AI connection.",
  "/en/culture-ai/",
);
export default function Page() {
  return (
    <div lang="en">
      <PageHero
        label="Culture × AI"
        title={
          <>
            Cultural depth.
            <br />
            New forms of expression.
          </>
        }
        description="Explore where imaging, knowledge and interaction meet cultural content. Published products and research directions are presented separately."
        path="/en/culture-ai/"
      />
      <CultureLab english standalone />
      <section className="container section lab-principles">
        <h2 data-reveal="editorial">New expression, grounded in evidence.</h2>
        <div className="principles-grid">
          <article>
            <h3 data-reveal="editorial">Grounded content</h3>
            <p data-reveal="content">
              Historical and object knowledge begins with sources and cultural
              review before entering an interactive experience.
            </p>
          </article>
          <article>
            <h3 data-reveal="editorial">Clear boundaries</h3>
            <p data-reveal="content">
              Generated content, project applications and research exploration
              are identified and assessed in context.
            </p>
          </article>
          <article>
            <h3 data-reveal="editorial">Evaluated technology</h3>
            <p data-reveal="content">
              Quality, response time, cost and personal image handling are
              considered together in project evaluation.
            </p>
          </article>
        </div>
      </section>
      <ContactCTA english />
    </div>
  );
}
