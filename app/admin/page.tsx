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
        description="项目与新闻的内容编辑、草稿和品牌预览。正式账号、审核与发布流程由后续后台承接。"
      />
      <section className="container admin-portal">
        <Button href="/admin/content/">编辑项目与新闻</Button>
        <p>当前支持浏览器草稿与页面预览；保存草稿不会发布到官网。</p>
        <Button href="/" secondary>
          返回网站
        </Button>
      </section>
    </>
  );
}
