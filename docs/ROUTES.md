# 信息架构与路径迁移

一级导航：能力 / 案例 / Culture × AI / 研发 / 关于 / 商务合作。

| 内容 | 稳定路径 | 栏目关系 |
| --- | --- | --- |
| 首页 | `/` | 品牌与项目主线 |
| 服务能力 | `/services/` | 四大业务与完整交付能力 |
| 产品目录 | `/products/`、`/products/<slug>/` | 可复用产品与系统，归入能力 |
| 场景方案 | `/solutions/` | 按文化场景组合能力，归入能力 |
| 案例 | `/cases/`、`/cases/<slug>/` | 精选与完整库使用同一案例目录 |
| Culture × AI | `/culture-ai/` | 从秦简到空间的四阶段概念装置 |
| 研发 | `/research/` | 正式 Research，保留研究方向、项目与报名，加入公开证据 |
| 技术体系 | `/research/technology/` | 归入研发 |
| 洞察 | `/insights/`、`/insights/<slug>/` | 新闻与编辑观点 |
| 关于 | `/about/` | 公司、团队、资质与完整资料 |
| 合作 | `/contact/` | 电话、需求整理与正式收件入口 |
| 影片 / 线上体验 | `/videos/`、`/experiences/` | 次级探索入口 |
| 英文 | `/en/.../` | 现有英文内容与新增英文核心页面 |

旧 `/work/`、三个 `/work/<slug>/`、`/technology/` 与精选案例的宣传册路径均保留跳转。部分重复新闻与英文高庙案例也并入稳定内容路径。完整规则在 `lib/routes.ts`，构建时输出兼容页，sitemap 排除旧路径，旧页标记 noindex 并指向新 canonical。

GitHub Pages 不能在 Next.js 静态导出中执行服务器重定向，因此使用 HTML meta refresh 与客户端 replace；有 JavaScript 时保留查询参数和锚点。没有将这种兼容跳转宣称为 HTTP 301。未来迁入支持服务器规则的托管环境时，应依据此映射配置真正的 301。

精选案例仍可展开查看完整原始项目内容与图集，原始快照完整保留。文章同样保留完整报道入口与内容。对重复的锚点采用命名空间，避免导览定位失效。

SEO：逐页 title、description、canonical、OpenGraph、Twitter Card；Organization、WebSite、BreadcrumbList；favicon、robots、sitemap；有对应内容的中英文页面设置 hreflang。导出的英文 HTML 使用 `lang=en`，不依赖客户端修改才能识别语言。
