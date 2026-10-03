# 设计与动效系统
定位：Culture × Technology × Experience；核心品牌表达“文化的深度，AI 的新表达。”。图片成为界面，文化内容决定版式，真实公开记录对应具体能力。
完整规格、移动规则与模块说明见 [DELIVERY.md](DELIVERY.md) D–K。

## 视觉约束
真实展馆与项目摄影为主。纸白、墨色、近黑与品牌红；方向渐变、媒体跨容器、窄正文与全宽图片交替，留出安静章节。里耶、布达拉宫、高庙保留各自文化气候。未采用 SaaS、科技地球、紫色 AI、发光脑、玻璃拟态或 Bento。

## 文件归属
styles/tokens.css：颜色、尺寸、字体与 motion。
base.css：语义基础、链接、按钮、可访问性、reduced-motion。
shell.css：导航、主题与菜单。
home.css：首页媒体叙事、转化过程、项目与证据。
culture-ai.css：微型装置。
search.css：搜索引导与结果。
experience-pages.css：服务索引、案例叙事、研发。
pages.css / interactive.css：保留的内容档案、产品、表单与公共交互。

## 动效
快速反馈 180ms，状态切换 360ms，章节 700ms；Hero 800–1600ms。原生 CSS 与观察器，无持续渲染循环。用户操作实时响应。无障碍降级保留内容与功能。
