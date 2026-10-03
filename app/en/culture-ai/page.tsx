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
      <ContactCTA english />
    </div>
  );
}
