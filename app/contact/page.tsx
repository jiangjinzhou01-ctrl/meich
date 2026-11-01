import { pageMetadata } from "@/lib/metadata";
import { ContactPage } from "@/components/contact-page";
export const metadata = pageMetadata(
  "联系我们",
  "与美创数字讨论文化展示、智慧文博、文创开发与合作需求。商务咨询：0731-89728572。",
  "/contact/",
);
export default function Contact() {
  return <ContactPage />;
}
