# MGC Digital Brand Experience System
湖南美创数字科技有限公司现有生产官网的旗舰重构，保留正式品牌、真实项目和完整原始公开内容快照。

Next.js 15.5 / React 19 / TypeScript / Static Export。
\n## 运行
\n```bash
npm ci
npm run dev
```
\n## GitHub Pages 构建
\n```bash
npm run typecheck
NEXT_PUBLIC_BASE_PATH=/meich NEXT_PUBLIC_SITE_URL=https://jiangjinzhou01-ctrl.github.io/meich npm run build
npm run check:export
NEXT_PUBLIC_BASE_PATH=/meich npm start
```
打开 http://localhost:3000/meich/。根域部署不设置 base path；改变路径或域名必须重新构建。
推送 main 后 .github/workflows/deploy.yml 自动检查并发布 out/。仓库 Settings → Pages 使用 GitHub Actions。本轮远程发布尚受连接器写入超时阻塞，不能把现有线上旧版当成本次发布。

## 文档
- [完整 A–P 交付说明](docs/DELIVERY.md)
- [验收与测试方法](docs/QA.md)
- [公开证据及待确认数据](docs/EVIDENCE.md)
- [本轮审查](docs/REBUILD-AUDIT.md)
- [设计系统](docs/DESIGN.md)
- [交互登记](docs/FUNCTIONS.md)
- [路由说明](docs/ROUTES.md)

维护位置：lib/content.ts 真实业务/案例；lib/source-pages.json 原始内容；lib/search.ts 搜索；lib/evidence.ts 外部公开证据；components/ 页面模块；styles/ 职责分层 CSS。Core 页面都有 /en/ 对应版。旧路径静态兼容跳转。
联系接口为 NEXT_PUBLIC_CONTACT_ENDPOINT；未配置时需求只整理在本机，使用原站正式联系渠道。Culture × AI 是预置概念，Research Canvas 是图片采样示意，没有伪装实时 AI 或真实三维扫描。
