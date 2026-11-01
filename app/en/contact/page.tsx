import { pageMetadata } from "@/lib/metadata";
import { ContactPage } from "@/components/contact-page";
export const metadata = pageMetadata(
  "Contact MGC",
  "Discuss cultural exhibitions, museum technology and collaboration with MGC Digital.",
  "/en/contact/",
);
export default function Contact() {
  return <ContactPage english />;
}
