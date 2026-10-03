import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { PageHero, ContactCTA } from "@/components/ui";
import { SolutionsExplorer } from "@/components/solutions-explorer";
export const metadata: Metadata = pageMetadata(
  "解决方案",
  "面向博物馆、文化展示、文创与文化运营，组合内容、空间和数字技术。",
  "/solutions/",
);
export default function Solutions() {
  return (
    <>
      <PageHero
        label="解决方案"
        title={
          <>
            每一种文化，
            <br />
            都值得自己的表达。
          </>
        }
        description="从场景与内容出发，选择合适的媒介、技术与服务，让文化与观众建立联系。"
      />
      <section className="container section solution-section">
        <SolutionsExplorer />
        <p className="content-note">
          按实际场景组合建设，项目内容与实施边界在需求沟通后明确。
        </p>
      </section>
      <ContactCTA />
    </>
  );
}
