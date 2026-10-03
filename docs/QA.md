# 当前版本验收
日期：2026-10-03。测试生产静态导出，真实 Chromium 浏览器；不以阅读源码代替体验。
\n## 结果
| 检查 | 结果 |
| --- | --- |
| TypeScript | 通过 |
| Production build | 通过，569 个可检查 HTML 页面 |
| 站内链接 / 图片 | 0 失效 |
| 本地 srcset / 锚点 | 0 失效 |
| 响应式 | 10 宽度 × 9 页面 = 90 组，通过 |
| 核心交互 | 8 项，通过 |
| 双主题无障碍 | 5 页面 × light/dark = 10 次 axe，0 违规 |
| 运行错误 | 0 |
| 补充验证 | 真实媒体加载、旧产品筛选、无 JS 内容、非 reduced-motion 搜索滚动通过 |
| 本地 Lighthouse mobile | 97 / 100 / 100 / 100；LCP 2.7s / CLS 0 / TBT 30ms / 约 520KiB |

宽度：320、360、390、412、430、768、1024、1280、1440、1920。
页面：首页、服务、案例目录、里耶详情、Culture × AI、Research、产品、联系、英文首页。
交互：移动导航、搜索定位与 URL、空结果与重置、文化装置四阶段/键盘/重置、案例释读和档案、研究采样、影片弹层、旧路径查询参数兼容。
后续视觉检查确认手机 Hero 使用 640×959 的真实竖构图，而非被大幅放大的 640px 横图；案例标题孤字修复。补充旧产品参数 domain=heritage&venue=venue:museum，返回有效结果。

## 报告
rebuild-browser.json、rebuild-export.json、rebuild-visual-followup.json、export-links.json、lighthouse-summary.json 为当前记录。previous-snapshot 为历史/中间记录，不作为此次通过结果。
截图以经过加载与实际滚动后的 viewport 为主：desktop-home-viewport、mobile-hero-final、home-reel、home-case、services-scene、case-hero-final、case-annotation、culture-installation、english-320。

## 方法与限制
Chromium 本地静态服务使用 /meich 路径与 gzip。axe 采用 WCAG2A/AA 与 WCAG2.1AA；自动扫描不能替代所有真实辅助技术测试。系统没有完整中文字体，截图验证临时注入 Noto Sans SC；正式网站仍使用系统中文字体，此 QA 字体未进入网页包。
Lighthouse 为本地移动设备/网络模拟，服务器和缓存与 GitHub Pages 不完全相同。97 分不等同于真实用户 Core Web Vitals。
所有导出目标经过检查，外部影片、原站报名和第三方体验有独立可用性与网络条件；上传源码不包含其后台。联系接口未配置时明确不发送，Culture × AI 不调用实时模型，Research Canvas 不是真实扫描系统。
上线验收应检查 main 提交对应的 GitHub Actions 成功记录，再复查 Pages 上的新 Hero、搜索、案例和 Culture × AI，避免把旧部署作为本轮验证结果。

上线搜索回归：排除推荐案例与通用 CTA 的正文索引，中文博物馆 55 项、英文 museum 62 项；规划馆与广场项目不会因“继续了解”中的其他博物馆而误命中。检查使用真实内容库，结果见 docs/qa/search-regression.json。标题与标签匹配优先排序。
