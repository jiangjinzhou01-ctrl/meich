import { StaticRedirect } from "@/components/static-redirect";
export const metadata = {
  title: "案例页面已迁移",
  robots: { index: false, follow: true },
  alternates: { canonical: "/cases/" },
};
export default function Page() {
  return <StaticRedirect to="/cases/" />;
}
