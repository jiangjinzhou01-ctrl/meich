import { StaticRedirect } from "@/components/static-redirect";
import { projects } from "@/lib/content";
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title: "案例页面已迁移",
    robots: { index: false, follow: true },
    alternates: { canonical: `/cases/${slug}/` },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <StaticRedirect to={`/cases/${slug}/`} />;
}
