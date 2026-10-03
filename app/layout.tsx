import type { Metadata } from "next";
import localFont from "next/font/local";
const GeistSans = localFont({
  src: "../public/fonts/mgc-geist-latin.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
});
import { Navbar, Footer, MotionProvider } from "@/components/shell";
import { company, siteUrl, asset } from "@/lib/content";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `美创数字 · ${company}`, template: `%s · 美创数字` },
  description:
    "湖南美创数字科技有限公司，专注文化与科技融合。连接文化研究、空间设计、数字技术与 AI，让文化成为可感知、可参与的体验。",
  icons: { icon: asset("/favicon.svg") },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: company,
    title: "MGC美创数字 · 文化的深度，AI的新表达。",
    description: "连接文化研究、创意设计与AI，创造可感知的新体验。",
    images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${siteUrl}/og.png`],
  },
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={GeistSans.variable} lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('meichuang-theme');document.documentElement.dataset.theme=t||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light')}catch(e){document.documentElement.dataset.theme='light'}`,
          }}
        />
      </head>
      <body>
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
        <a href="#main" className="skip-link">
          跳至正文
        </a>
        <Navbar />
        <main id="main">
          <MotionProvider>{children}</MotionProvider>
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${siteUrl}/#organization`,
                  name: company,
                  url: siteUrl,
                  logo: `${siteUrl}/brand/logo.svg`,
                  telephone: "+86-731-89728572",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "梅溪湖路76号，梅溪湖国际研发中心2栋",
                    addressLocality: "长沙",
                    addressRegion: "湖南",
                    addressCountry: "CN",
                  },
                },
                {
                  "@type": "WebSite",
                  name: company,
                  url: siteUrl,
                  inLanguage: ["zh-CN", "en"],
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
