# 项目与新闻：后台接入约定

## 已实现的前端

`/admin/content/` 提供项目/新闻切换、标题、URL、简介、分类、日期、地点、封面、叙事段落、浏览器草稿、JSON 导入/下载及页面预览。项目与新闻预览共用品牌系统，文字使用模糊渐清动效，支持手机和减少动态效果。示例封面明确标注为既有项目素材。

草稿保存在当前浏览器。当前没有登录、数据库、服务端上传、审核或真实发布；编辑工具不会更改官网内容。不能将浏览器草稿当成团队共享数据。

## 内容契约

`lib/content-drafts.ts` 定义 `ContentDraft`，JSON 下载与导入共用这个结构：

```json
{
  "schemaVersion": 1,
  "id": "server-assigned-id",
  "kind": "project",
  "status": "draft",
  "title": "真实内容标题",
  "slug": "project-slug",
  "summary": "经校对的简介",
  "category": "数字展示",
  "date": "2026-10-04",
  "location": "经确认的项目地点",
  "cover": { "url": "/uploads/image.webp", "alt": "真实画面说明" },
  "sections": [{ "heading": "文化起点", "body": "章节正文" }],
  "updatedAt": "2026-10-04T00:00:00.000Z"
}
```

`kind` 取 `project` 或 `insight`，未来公开地址保持 `/cases/{slug}/` 与 `/insights/{slug}/`。这份示例是字段说明，不是企业新增项目或新闻事实。当前编辑模型只包含 draft；正式后台应另外定义审核与发布状态，不能信任客户端传入的状态。

## 后续接口规划（当前未实现）

| 操作 | 规划接口 | 接入位置 |
| --- | --- | --- |
| 登录与会话 | `/api/auth/*` | 工作台访问保护、角色权限 |
| 列表、详情、新增、编辑 | `/api/content`、`/api/content/{id}` | 替换组件中的本机 `persist` 和读取草稿逻辑 |
| 素材上传 | `/api/media` | 替换 `uploadCover`，返回正式素材 URL 和 ID |
| 审核与发布 | `/api/content/{id}/publish` | 添加真正发布动作与状态回执 |
| 公开内容读取 | `/api/public/content` 或服务端 repository | 案例、新闻、首页、搜索与站点地图的数据来源 |

建议将内容读取与写入放入独立 repository 层，组件继续使用上述字段；新增内容应同时进入列表、详情、搜索和 sitemap。数据库选择、认证方式、审核角色、资产存储及备份策略在正式后台阶段确定。需要校验字段、处理 slug 冲突、检查素材类型、保存版本与操作记录。

当前图片上传是最大 2MB 的本机预览图，可能作为 data URL 存入草稿。正式后台应上传原始素材到服务端或对象存储，将 data URL 换成正式地址，生成 WebP/AVIF 与响应式尺寸。不要将客户端图片地址直接当成已审核的正式资产。

## 部署模式

`npm run build:server` 生成 Next.js standalone 服务端程序，后续可以新增 API、数据库与服务端读取。默认 `npm run build` 仍生成 GitHub Pages 静态版，供现有公开预览使用；真实后台只能部署在服务端模式。
