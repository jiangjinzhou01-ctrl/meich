import { ResearchPage } from "@/components/research-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Research",
  "Digital heritage, museum systems and interactive research.",
  "/en/research/",
);
export default function Page() {
  return <ResearchPage english />;
}
