import { PageHero, Button } from "@/components/ui";
import { pageMetadata } from "@/lib/metadata";
export const metadata = {
  ...pageMetadata(
    "品牌工作台",
    "美创品牌内容、素材与发布工作台入口。",
    "/admin/",
  ),
  robots: { index: false, follow: false },
};
export default function Admin() {
  return (
    <>
      <PageHero
        label="MGC BRAND WORKSPACE"
        title={
          <>
            每一次表达，
            <br />
            都积累品牌的力量。
          </>
        }
        description="品牌管理部的内容、素材与发布工作台。现有账号、内容管理与发布流程继续由正式后台承接。"
      />
      <section className="container admin-portal">
        <a className="button" href="https://www.mgcdigi.com/admin">
          进入品牌工作台 <span aria-hidden="true">↗</span>
        </a>
        <p>使用品牌负责人分配的账号，在原工作台完成登录。</p>
        <Button href="/" secondary>
          返回网站
        </Button>
      </section>
    </>
  );
}
