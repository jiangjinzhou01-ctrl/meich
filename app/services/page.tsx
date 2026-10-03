import { ServicesPage } from "@/components/services-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "服务能力",
  "数字展示、数字文博、数字文创与数字运营，连接文化研究、空间设计和数字技术。",
  "/services/",
);
export default function Page() {
  return <ServicesPage />;
}
