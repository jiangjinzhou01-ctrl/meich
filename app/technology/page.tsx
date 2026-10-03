import { StaticRedirect } from "@/components/static-redirect";
export const metadata = {
  title: "技术体系页面已迁移",
  robots: { index: false, follow: true },
  alternates: { canonical: "/research/technology/" },
};
export default function Page() {
  return <StaticRedirect to="/research/technology/" />;
}
