import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "页面未找到",
  robots: { index: false, follow: true },
};
import { Button } from "@/components/ui";
export default function NotFound() {
  return (
    <section className="container not-found">
      <span>404</span>
      <h1>
        这个页面，
        <br />
        暂时没有找到。
      </h1>
      <p>你可以回到首页，继续探索美创数字。</p>
      <Button href="/">返回首页</Button>
    </section>
  );
}
