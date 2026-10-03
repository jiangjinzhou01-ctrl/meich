# 湖南美创数字科技有限公司 · 官网

为 MGC 美创数字定制的多页面网站。以文化与科技融合为定位，使用公司正式 Logo、美创红、真实项目图片与原创空间模块动效。

Next.js 15 / React 19 / TypeScript / CSS Design Tokens / Motion。技能只用于设计与质量方法，未使用技能包中的模板或图片。

## 运行

```bash
npm ci
npm run dev
```

开发地址：http://localhost:3000。

```bash
npm run typecheck
npm run build
npm start
```

静态产物在 `out/`。`npm start` 用于本地预览静态产物。

## GitHub Pages

在线地址：https://jiangjinzhou01-ctrl.github.io/meich/

main 分支更新自动进行类型检查、构建与部署。Pages 已配置 GitHub Actions。

```bash
NEXT_PUBLIC_BASE_PATH=/meich NEXT_PUBLIC_SITE_URL=https://jiangjinzhou01-ctrl.github.io/meich npm run build
NEXT_PUBLIC_BASE_PATH=/meich npm start
```

## 页面与体验

首页、服务、解决方案、案例列表及3个案例详情、关于美创、技术能力、洞察列表及3篇内容、人才交流、联系我们、隐私说明、404、Loading。完整浅色/深色主题、移动菜单、交互能力图、方案筛选、人才方向筛选与详情、需求表单。

SEO 包含逐页标题、描述、Canonical、OG、Organization、WebSite、BreadcrumbList、sitemap.xml 与 robots.txt。社交分享使用正式 Logo 与 AI 品牌主张；案例与动态分别使用对应项目图片。

## 企业资料

资料来自用户指定的 https://www.mgcdigi.com ，核对日期 2026-10-03。见 [资料来源](docs/SOURCES.md) 与 [素材说明](docs/ASSETS.md)。

- 实际业务：数字展示、数字文博、数字文创、数字运营。
- 正式品牌标志使用现有官网 SVG；MGC DIGITAL 为现有品牌表达，不声明正式英文法律名称。
- 项目：里耶古城（秦简）博物馆、布达拉宫雪城展览升级改造、高庙遗址博物馆。
- 商务电话与地址采用现有官网公开信息。
- 招聘资料未确认，当前为人才交流方向，明确标注非在招职位。
- 未生成客户评价、员工规模、营收、专利数量、成果指标或 ICP 号。

## 咨询表单

当前支持校验、错误摘要、焦点管理与本地需求文件下载；不自动发送、不显示虚假成功。提供真实商务电话，方便确认后续接收方式。

启用在线收件需设置仓库变量 `CONTACT_ENDPOINT`，服务应支持 HTTPS JSON POST 和跨域访问。该变量是公开接口地址，不能包含密钥。接收服务负责限流、反垃圾、服务端验证与信息保护。启用前请更新 `app/privacy/page.tsx` 中的接收服务与数据保存政策。

## 维护

- `lib/content.ts`：服务、真实案例、流程、动态及企业联系信息
- `components/`：可复用导航、动效、卡片、交互图、表单与对话框
- `app/`：路由与 SEO；`app/globals.css`：双主题 tokens、布局与 motion
- `public/brand/`：官网授权复用素材，已做 WebP 与尺寸优化
- `docs/`：设计、事实来源、素材与验证记录

支持键盘操作、焦点状态、prefers-reduced-motion，动效离开视口或页面后台时暂停。没有滚动劫持、强制开场动画或第三方跟踪脚本。

## 字体与图标

Geist 通过官方包本地加载，使用 SIL Open Font License；Lucide 图标使用 ISC。公司原有素材权利归对应权利人，使用依据为本次官网开发授权。

## 现有官网功能与完整内容

现有548个公开路由及中英文内容已纳入静态快照，保留产品搜索、标签筛选、案例筛选、94部影片、线上虚拟展厅、PrismWeave工具、研发参与、伙伴申请与品牌工作台入口。详见 [功能保留矩阵](docs/FUNCTIONS.md)。

正式收件、报名和后台继续由原站处理。GitHub Pages不能承载原站服务器与数据库，且原接口没有跨域授权，因此提供真实提交入口。没有创建假后台、假申请编号或假成功状态。

如需刷新后台发布后的公开内容，可在 Actions 手动运行部署时勾选 `refresh_content`。首次部署使用当前已核对快照。迁入统一后台或实时更新需要原站源码及服务器配置。

完整长篇案例图集与视频保留公开原地址；首页、目录和主要封面已本地优化。`lib/source-pages.json`维护原始公开内容，`lib/source-taxonomy.json`维护原标签，`lib/source-image-map.json`映射本地封面。
