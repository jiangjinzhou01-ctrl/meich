import { AboutPage } from "@/components/about-page";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "About MGC Digital",
  "Based in Changsha, MGC Digital brings cultural research, exhibition design, digital production and museum software together.",
  "/en/about/",
);

export default function About() {
  return <AboutPage english />;
}
