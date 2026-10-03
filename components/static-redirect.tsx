"use client";
import { useEffect } from "react";
import Link from "next/link";
import { basePath } from "@/lib/content";
export function StaticRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(
      `${basePath}${to}${window.location.search}${window.location.hash}`,
    );
  }, [to]);
  return (
    <section className="container page-hero">
      <meta httpEquiv="refresh" content={`3;url=${basePath}${to}`} />
      <h1>正在前往新版页面</h1>
      <p>
        <Link className="text-link" href={to}>
          继续访问 ↗
        </Link>
      </p>
    </section>
  );
}
