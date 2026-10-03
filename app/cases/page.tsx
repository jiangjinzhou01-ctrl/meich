import { CasesPage } from "@/components/cases-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "项目案例",
  "美创数字真实文化展示、数字文博与互动体验项目。了解项目内容与美创职责。",
  "/cases/",
);
export default function Cases() {
  return <CasesPage />;
}
