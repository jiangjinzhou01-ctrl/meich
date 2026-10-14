# MGC 全站 Motion Design System

基于现有生产源码升级动效，保留品牌、内容、路由、业务功能与企业服务器 standalone 部署方式。

## 机制与参数

`styles/motion.css` 统一视觉参数；`components/motion.tsx` 为唯一的内容渐显观察器。导航场景和 Artifact Journey 的观察器只负责各自交互状态，不重复控制文字。

| 层级 | 桌面时长 | 桌面 Blur / Y | 手机时长 | 手机 Blur / Y | 场景 |
| --- | --- | --- | --- | --- | --- |
| Cinematic | 980ms | 7px / 18px | 880ms | 4px / 12px | Hero、案例主标题、品牌宣言 |
| Editorial | 720ms | 4px / 12px | 650ms | 2px / 8px | 章节标题、服务与文化主题 |
| Content | 480ms | 0px / 6px | 420ms | 0px / 4px | 正文、说明、元数据 |
| Interaction | 240ms | 0px / 4px | 200ms | 0px / 4px | 切换、搜索、即时反馈 |

缓动统一为 `cubic-bezier(.16,1,.3,1)`。组内错峰桌面 90ms、手机 60ms，最多四个步长；正文不应用明显 Blur。研究区的 Editorial Blur 降至 2px。图片在自身边界内做轻微缩放，不造成页面横向溢出。

## 接入方法

`data-reveal` 使用 `cinematic/editorial/content/interaction/media`；旧 `blur` 为 Editorial 别名，`line` 使用无模糊遮罩进入，`scale` 兼容安全媒体缩放。

`data-reveal-group` 用于一组短内容，标识 0、标题/图片 1、正文 2、CTA 3；用 `data-reveal-order` 覆盖。不要把长页面或完整项目资料合并为一个组。

`RevealText` 支持语义标签与按行错峰。首屏 `data-motion-enter` 由 CSS 直接播放，避免 hydration 后再隐藏文字。滚动文字在观察器就绪后才预备；无 JS 或观察器不可用时仍可读。完成、焦点进入、恢复可见和 Reduced Motion 都会清理隐藏状态与滤镜。

`data-motion-scope="interaction"` 接入有稳定 key 的切换面板，只对文本子层进行短时、无 Blur 的反馈，避免旧内容叠加。外层路由不再使用 transform，保持 Sticky、固定定位与滚动恢复。

## 实施范围

- 首页 Opening、品牌宣言、沉浸影像、Artifact Journey、精选案例、Culture × AI、Research、证据、关于、商务 CTA 与页脚重要文字。
- 案例索引、详情、各章节、图片、元数据和下一案例。取消大型章节容器整体模糊。
- 服务、解决方案、技术体系、Culture × AI 面板。整合旧 `opening/text-clarify/panel-in` 和路由外层动画。
- 搜索标题、说明、短结果错峰（最大延迟 120ms）与空状态；输入不受模糊或等待影响。
- 关于、研究、新闻、联系、人才、隐私、中英文公共模板及原始资料档案。
- 保留圆形菜单，统一链接进入/退出，关闭后再导航，保留焦点恢复与滚动锁定。快速关闭从当前 clip-path、透明度与位移继续退出，避免中断进入时跳到完全展开状态。
- 历史条目记录滚动位置；返回、刷新恢复已读位置，避免重复隐藏；BFCache 释放未完成渐显。

## 运行与部署

```sh
npm ci
npm run dev
npm run typecheck
npm run build:server
npm run package:server
```

服务器模式默认将 SEO 域名设为 `https://www.mgcdigi.com`，可用 `NEXT_PUBLIC_SITE_URL` 覆盖，避免生产包误用 localhost。

生成 `dist/MGC-Enterprise-Server`，在该目录执行 `./start.sh`。Nginx、systemd、Docker 和域名配置见 `deployment/README.md`。

## 浏览器验收

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
npm run check:motion
```

脚本启动已生成的 standalone 程序，覆盖 320、375、390、430、768、1024、1440、1920px，以及首屏、慢/快滚动、菜单、路由、面板、搜索、历史恢复、Reduced Motion、主题和表单输入。

受限测试机可以通过 `MGC_PLAYWRIGHT_MODULE`、`MGC_CHROMIUM_PATH` 指定测试工具；没有中文字体时通过 `MGC_QA_FONT_DIR` 指向 `@fontsource/noto-sans-sc`，只向测试浏览器提供字体，不加入生产依赖。

实际结果见 `docs/qa/motion-regression.json`。初轮记录在 `motion-regression-initial.json`：已针对修复全幅媒体缩放越界与历史恢复偏移；手机主题入口位于菜单，初轮点击隐藏桌面入口属于测试路径错误。

2026-10-09 补充验证菜单快速关闭。`MGC_QA_ONLY=圆形菜单 MGC_QA_REPORT=motion-menu-regression.json npm run check:motion` 对实际 standalone 部署包通过：3 次完整开关、4 次在进入动画中途关闭、退出后焦点与滚动锁恢复、关闭后客户端导航，且无浏览器异常。菜单文字从捕获的透明度与位移退出，圆形遮罩从当前半径收起。此轮只重复菜单定向测试与 `npm run typecheck`；上轮全站 10 项验收记录保留。

首次补充测试读到了未重新打包的旧运行文件，失败记录保留在 `motion-menu-regression-initial.json`。重新执行 `npm run package:server` 后，运行文件包含该修复，定向测试通过。`MGC_QA_ONLY` 可筛选测试名称，`MGC_QA_REPORT` 可另存结果，避免覆盖全站验收记录。

## 边界

没有新增生产依赖。Chromium 宽度模拟不代表实体 Android、Safari 或企业服务器验收。

原附件的内容工作台仍为浏览器草稿编辑与预览，未实现正式登录、团队数据库、审核发布，本次没有伪装成正式 CMS。联系表单保留需求整理/下载与可配置端点；真实收件需要企业设置 `NEXT_PUBLIC_CONTACT_ENDPOINT`，本次没有向外部收件人发送测试数据。

原企业长片约 97MB 未包含在附件中，部署时需按原说明保留或迁移该媒体文件。
