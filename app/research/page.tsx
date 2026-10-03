import { ResearchPage } from "@/components/research-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "研究与研发",
  "文物数字化、智慧博物馆与互动系统。查看美创公开研究、项目及证据。",
  "/research/",
);
export default function Page() {
  return <ResearchPage />;
}
