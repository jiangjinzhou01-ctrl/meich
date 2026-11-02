# MGC Digital Brand Experience System
湖南美创数字科技有限公司现有生产官网的旗舰重构，保留正式品牌、真实项目和完整原始公开内容快照。

Next.js 15.5 / React 19 / TypeScript / Static Export。

## 运行

```bash
npm ci
npm run dev
```

## GitHub Pages 构建

```bash
npm run typecheck
npm run check:search
NEXT_PUBLIC_BASE_PATH=/meich NEXT_PUBLIC_SITE_URL=https://jiangjinzhou01-ctrl.github.io/meich npm run build
npm run check:export
NEXT_PUBLIC_BASE_PATH=/meich npm start
```
打开 <http://localhost:3000/meich/>。根域部署不设置 base path；改变路径或域名必须重新构建。
推送 main 后 .github/workflows/deploy.yml 自动检查并发布 out/。仓库 Settings → Pages 使用 GitHub Actions。部署地址：<https://jiangjinzhou01-ctrl.github.io/meich/>。

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

## 全站动效升级

本轮实现见 [docs/MOTION-SYSTEM.md](docs/MOTION-SYSTEM.md)，验收见 `docs/qa/motion-regression.json`。原有服务器部署、内容工作台和联系功能保留。

## Experience Refinement V2.5

本次升级与真实验证范围见 [V2.5 审计](docs/V2.5-AUDIT.md) 和 [V2.5 交付与验收](docs/V2.5-DELIVERY.md)。独立开发分支不触发正式 Pages 部署。

生产副本预览（构建时使用 `/meich`）：

```bash
node scripts/prepare-preview.mjs
# 在支持 Sites preview 的环境中：
sites-preview start "$PWD/qa-results/preview"
```

打开返回地址的 `/qa.html` 可切换十二个页面与十个屏宽。普通本机仍可按前述 `NEXT_PUBLIC_BASE_PATH=/meich npm start` 预览。

## MGC Digital V3.0

V3.0 在 V2.5 上增量升级首屏摄影构图、三旗舰案例叙事、文化资料探索与商务路径。原始档案、双语路由、正式品牌、搜索及两种部署方式继续保留。

- [基线审计与实施决策](docs/V3.0-AUDIT.md)
- [交付、素材与维护说明](docs/V3.0-DELIVERY.md)
- [测试环境与实际结果](docs/V3.0-QA.md)
- 截图：`docs/qa/v3.0/`；浏览器报告：`docs/qa/v3.0-browser.json`

可选浏览器验收（测试工具放在仓库外，无新增生产依赖）：

```bash
npm install --prefix /tmp/mgc-qa --no-package-lock playwright@1.56.1
/tmp/mgc-qa/node_modules/.bin/playwright install chromium
# 先按上文构建 /meich 静态导出。脚本自行启动静态预览：
MGC_PLAYWRIGHT_MODULE=/tmp/mgc-qa/node_modules/playwright npm run check:v3
# 再顺序构建并打包服务器，不能与静态构建并行：
npm run build:server
npm run package:server
MGC_PLAYWRIGHT_MODULE=/tmp/mgc-qa/node_modules/playwright MGC_QA_REPORT=v3.0-motion.json npm run check:motion
```

已有 Chromium 时可设置 `MGC_CHROMIUM_PATH`；容器可按需要设置 `MGC_CHROMIUM_ARGS='["--no-sandbox"]'`。PR 工作流自动运行这两组浏览器检查并上传证据，只有 main 的既有发布工作流会部署正式站。

手机图片轨道的轻滑/惯性专项回归：完成静态构建后，使用相同 Playwright 环境执行 `npm run check:swipe`。说明见 [触摸优化](docs/TOUCH-REFINEMENT.md)，结果在 `docs/qa/swipe-regression.json`。
