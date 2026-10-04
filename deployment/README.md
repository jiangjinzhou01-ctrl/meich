# MGC 企业服务器部署包

包含可运行的 Next.js / Node.js 服务端程序与完整源码，适合企业 Linux 服务器。现有前台使用预渲染保持性能；运行模式保留后续增加 API、数据库和正式内容后台的能力。

## 目录

- `app/`：已编译程序、运行依赖、前端资源、真实项目图片。
- `source/`：完整源码、依赖锁文件、Dockerfile、内容字段与后台接入说明。
- `start.sh`：Linux 启动脚本。
- `compose.yaml`：从源码构建的 Docker Compose 示例。
- `nginx.conf.example`：反向代理示例。
- `mgc.service.example`：systemd 服务示例。
- `BUILD-INFO.json`：交付版本与构建参数。

## 直接运行

预编译包面向 Linux x64，服务器安装 Node.js 22 或更新的受支持版本即可运行。无需在服务器再次安装 npm 依赖。

```sh
cd MGC-Enterprise-Server
chmod +x start.sh
./start.sh
```

访问服务器的 3000 端口；端口可通过 `PORT=3100 ./start.sh` 调整。生产部署使用 Nginx 将域名代理到本机端口，再通过企业运维流程配置 HTTPS 与进程管理。服务端口与域名按企业服务器的现有规划设置。

前台：`/`；内容工作台：`/admin/content/`；案例：`/cases/`；新闻：`/insights/`。

## 常驻运行与反向代理

将包放在 `/opt/mgc`（即 `/opt/mgc/app/server.js` 存在）。参考 `mgc.service.example` 配置服务；示例中的 `mgc` 用户与 `/usr/bin/node` 路径由运维按实际环境调整。服务监听本机 3000 端口，Nginx 配置参考 `nginx.conf.example`。Windows、ARM 或不同基础环境，请使用源码或 Docker重新构建。

## Docker 方式

Dockerfile 放在 `source/`，Compose 放在部署包根目录。

```sh
docker compose up -d --build
```

Compose 默认仅将服务映射到本机 `127.0.0.1:3000`，由反向代理提供外部访问。修改 `compose.yaml` 的站点域名构建参数后重新构建。容器部署示例已提供；本次验收为 Node.js standalone 直接运行，不代表已在你的企业服务器部署。

## 域名与源码更新

此包去掉 GitHub Pages 的 `/meich` 前缀，部署在域名根目录。SEO 域名默认使用既有企业官网 `https://www.mgcdigi.com`。如果正式使用其他域名，需要在构建时修改 `NEXT_PUBLIC_SITE_URL`，使 canonical、OpenGraph 与 sitemap 同步。

```sh
cd source
npm ci
NEXT_PUBLIC_BASE_PATH= NEXT_PUBLIC_SITE_URL=https://你的正式域名 npm run build:server
NEXT_PUBLIC_SITE_URL=https://你的正式域名 npm run package:server
```

生成的 `source/dist/MGC-Enterprise-Server/` 即新部署目录。上面的行内环境变量写法适用于 Linux/macOS；Windows 用终端对应的环境变量语法。`build:server` 和 `start:server` 本身支持跨平台。

## 项目、新闻与后续后台

已完成编辑与预览界面：项目/新闻类型、标题、URL、简介、分类、日期、地点、封面预览、叙事段落、草稿保存、JSON 导入/下载，以及模糊渐清的品牌页面预览。

当前草稿只保存在编辑者的浏览器，不会更新线上项目/新闻。正式登录、团队数据、审核、发布、数据库和素材上传均需后续后台接入。不要将这一前端工作台当成已经完成的正式内容管理系统。

具体类型和接入位置见 `source/lib/content-drafts.ts` 与 `source/docs/CMS-INTEGRATION.md`。该说明包含拟定接口、公开内容路由及后续搜索/sitemap更新要求。

## 既有素材和业务接口

品牌长片仍引用原官网 `/brand/company-films/company.mp4`，本包未包含约 97MB 的原视频文件。替换既有企业网站时，请保留或迁移该文件到同一公开路径；也可在 `source/components/film-dialog.tsx` 改为企业媒体存储地址后重新构建。

联系表单维持现有需求整理/下载行为。正式在线收件可在重新构建时配置 `NEXT_PUBLIC_CONTACT_ENDPOINT`，并提供相应的业务接口。改变 `NEXT_PUBLIC_*` 参数需要重新构建，不是仅修改已编译程序的运行环境。

## 验收与更新

构建版本见 `BUILD-INFO.json`。交付前会验证服务端启动、根目录资源、页面与客户端导航、内容编辑/草稿/导入下载/预览，以及手机布局、动效和减少动态支持。源码内 `docs/qa/enterprise-server-regression.json` 保存验收记录。
