import { AboutPage } from "@/components/about-page";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "关于美创数字",
  "湖南美创数字科技有限公司在长沙开展文化研究、展陈设计、数字内容制作和智慧软件开发。",
  "/about/",
);

export default function About() {
  return <AboutPage />;
}
