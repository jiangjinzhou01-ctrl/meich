import type { NextConfig } from "next";
const config: NextConfig = {
  output: process.env.MGC_DEPLOY_TARGET === "server" ? "standalone" : "export",
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: { unoptimized: true },
};
export default config;
