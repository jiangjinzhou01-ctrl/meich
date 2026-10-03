import { CasesPage } from "@/components/cases-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Work",
  "Cultural exhibitions, digital museums and interactive experiences by MGC Digital.",
  "/en/cases/",
);
export default function Cases() {
  return (
    <div lang="en">
      <CasesPage english />
    </div>
  );
}
