import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
export const metadata: Metadata = pageMetadata(
  "隐私说明",
  "了解网站咨询表单与本地主题偏好的信息处理方式。",
  "/privacy/",
);
export default function Privacy() {
  return (
    <>
      <PageHero
        label="隐私说明"
        title="尊重每一次信任。"
        description="本说明介绍当前网站如何处理你主动填写的信息与浏览偏好。"
      />
      <article className="article-body container legal-body">
        <h2>咨询信息</h2>
        <p>
          表单包含姓名、公司、联系方式、需求类型、可选预算和项目介绍。当前在线收件通道尚未配置，填写内容仅在当前页面内存中使用，不会自动发送或上传。下载需求文件只会将内容保存到你选择的设备。
        </p>
        <h2>正式在线申请</h2>
        <p>
          选择“在线提交合作需求”、生态伙伴申请或研发报名时，将进入美创现有官网的正式提交页面。信息处理以接收页面的隐私说明为准。本站不会将本地下载的文件自动传给原站。
        </p>
        <h2>主题偏好</h2>
        <p>
          网站使用浏览器本地存储保存你选择的浅色或深色主题。该偏好保留在你的设备，不会用于识别个人。你可以清除浏览器网站数据来删除它。
        </p>
        <h2>统计与第三方资源</h2>
        <p>
          本网站未接入广告、用户画像或第三方统计脚本。视频、完整项目图集与部分体验由美创原站或对应服务提供。打开地图、线上展厅或设计工具时，将访问对应服务并遵循其政策。GitHub
          Pages 作为托管服务可能处理必要访问日志，请参阅 GitHub 的隐私声明。
        </p>
        <h2>联系与更正</h2>
        <p>
          如需咨询信息处理方式，可通过商务电话 0731-89728572
          联系美创。请勿在表单中填写密码、身份证号码、银行信息或其他与合作需求无关的敏感信息。
        </p>
      </article>
    </>
  );
}
