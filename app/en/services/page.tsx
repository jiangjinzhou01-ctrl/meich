import { ServicesPage } from "@/components/services-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Expertise",
  "Cultural research, exhibition design, digital production and museum software.",
  "/en/services/",
);
export default function Page() {
  return (
    <div lang="en">
      <ServicesPage english />
    </div>
  );
}
