# 素材与真实性

正式 Logo、展馆、办公空间、产品设备及封面来自上传源码中的现有素材。完整原始内容与图片映射保持在 `lib/source-pages.json` 与 `lib/source-image-map.json`。

## 已处理

- Hero 使用 1920px 高庙真实展馆图；V3 手机采用同一原图的 640×800 竖构图 WebP（52,764 bytes），保留雕塑与主题入口。此前 640×959 AVIF 文件保留，当前通过 mobileSource 明确选择构图。
- 关键图片制作 640 / 960px WebP 响应版本及 AVIF，保留原图，不通过放大制造清晰度。
- 使用明确尺寸、固定媒介比例、object-fit、首屏高优先级与非首屏懒加载。
- AI 设备小图另设 240px 版本。
- 品牌视频仅主动打开后加载，关闭时暂停并卸载播放器；保留正式原站视频地址。
- 新的 1200×630 社交分享图采用正式标志、真实空间与品牌主张。
- 本地字体子集附带 `public/fonts/Geist-OFL.txt`。

## 生成图

`public/brand/cultural-study.webp`、对应响应版本与 AVIF 为图像模型生成的「简牍文化视觉研究」，为既有生成表达研究资产。V2.5 文化装置改用真实里耶项目资料，不再展示此图；文件与来源记录保留，未作为真实文物、客户案例或现场产品输出。完整提示词见 `GENERATED-ASSET.md`。

## 优先补充的真实素材

1. 里耶主图及案例图集的无水印原图，建议 2400-3200px。现有 1080px 图在大型高 DPR 展示中仍有上限。
2. 高庙横版原图、更适合竖屏构图的项目摄影；1920px 可用，但不能覆盖所有大屏高 DPR 情况。
3. 旗舰项目 6-12 秒精简视频与移动端版本，确认可公开使用的片段、音乐和字幕。
4. AI 拍照与导览产品的真实界面、现场设备、生成成果，以及可公开说明的项目应用状态。
5. 每个案例的完整职责、技术配置、实施年份与交付资料；未公开年份继续标明。
6. 品牌规范、字体授权和现行资质资料，确认长期上线所需的最终版本。

部分现有项目图片仍含旧水印。未伪造新现场图替代，也未删去原始素材。后续应由企业提供无水印、授权清晰的正式原图。

## V3.0 art direction

`gaomiao-hero-mobile.webp` is a 640×800 derivative of the existing 1920×959 Gaomiao photograph: source rectangle `(90, 0)–(858, 959)`, downsampled without enlargement. It retains the sculpture and exhibition entrance on mobile. Source file and prior portrait AVIF remain intact. `ResponsiveImage.mobileSource` now opts into mobile art direction explicitly; it no longer silently applies the old portrait crop to all Gaomiao images.

ProjectStudy and Culture use only the original Gaomiao, Liye interpretation/exhibition/cinema and Potala assets. The inspector can display their original pixel dimensions. Cropped views are marked as crops/documentation; no generated image, new scan, fabricated transcription or invented camera angle was added. The Potala exterior is labelled as architectural context, with MGC’s published scope limited to the Snow City exhibition. The 762×508 interior plate remains visibly resolution-limited and is framed rather than treated as a new high-resolution photograph.

Four Gaomiao interior plates (`gaomiao-gallery-02`–`05.webp`, approximately 671–673×504, 20–27KB each) are now stored locally. Their original `mgcdigi.com/brand/company-cases/gaomiao-museum-0N.webp` URLs were already listed in `source-pages.json`; those live corporate URLs were checked and downloaded on 2026-11-01. The unmodified pixels and archive URLs are preserved, `source-image-map.json` resolves them locally, and the case presents them as small published records. They are not high-resolution replacements. Request originals from the company before using them as full-screen/high-DPR photography.
