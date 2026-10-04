import { ContentWorkspace } from "@/components/content-workspace";
import { pageMetadata } from "@/lib/metadata";
export const metadata = {
  ...pageMetadata("内容编辑与预览", "项目与新闻内容编辑、草稿和品牌页面预览。", "/admin/content/"),
  robots: { index: false, follow: false },
};
export default function ContentEditorPage() {
  return <ContentWorkspace />;
}
