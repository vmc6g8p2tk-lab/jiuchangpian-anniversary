# 旧唱片江景民谣 · 1周年庆电子邀请函

V1 风格确认 Demo。交付目标：2026-10-20。Vite + React + TypeScript + CSS + Framer Motion，无后台、数据库或账号系统。旧纸张、黑胶、唱针、旧照片和酒红色票根组成六个连续章节。

## 安装与运行

需要 Node.js 20.19+ 或 22.12+（本地使用 Node.js 24）。在本项目目录执行：

```bash
npm install
npm run dev
```

默认访问 http://localhost:5173 。开发服务器监听 0.0.0.0，同一 Wi-Fi 的手机可访问终端输出的 Network 地址；若受 Windows 防火墙拦截，请开放对应端口。按 Ctrl+C 停止。

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run preview
```

测试使用已安装的 Chrome；无 Chrome 的机器可安装 Chrome，或把 playwright.config.ts 的 channel 去掉后执行 `npx playwright install chromium`。测试覆盖三种手机宽度、章节切换、照片弹窗、音乐成功/拒绝、暂停续播、减少动画及资源。报告位于 playwright-report，截图位于 artifacts。真实微信和 iPhone 的设备测试仍须上线后进行。

## 内容和素材替换

所有客户内容集中在 **src/config/invitation.ts**：brand 品牌和 Logo、cover 封面、story 品牌故事、gallery 照片、celebration 节目、event 时间地址联系方式、ending 结尾、music 音乐、share 分享信息、ui 交互文字。修改后保存即更新；上线前重新构建。活动日期与交付截止日期分别管理，当前活动日期为待定。

图片放 **public/assets/images/**。将 gallery.photos 的 src、alt、caption 改为实际图片；收到正式照片后把 placeholder 设置为空字符串，去除占位标签。照片数组可增减，但 V1 的错落构图按三张设计，更多照片建议替换精选三张或调整样式。story.photo 是故事页照片。brand.logo 支持透明 PNG/SVG。图片建议 1200px 内、单图 150–250KB，首屏使用 CSS 黑胶，无大图下载。

WebP/AVIF 优化：把 JPG/PNG 放入图片目录，执行 `node scripts/optimize-images.mjs`，再在 gallery.photos 各项填写 webp 和 avif 路径；picture 会优先 AVIF，再 WebP，最后 src。脚本保留原图，并自动旋转、限制宽度。SVG Demo 素材不需要转码。图片 lazy loading、固定宽高和 decoding=async；不要使用 base64 大图。

背景音乐放 **public/assets/audio/**，修改 music.src（支持 MP3/AAC/WAV）、volume、enabled。直接覆盖 background.wav 也能替换，但内容格式应与扩展名一致。首屏点击开启邀请后尝试播放，右上角唱片可播放/暂停；拒绝播放不阻断浏览，不依赖微信私有自动播放技巧。Demo 音频为本项目原创合成占位曲，正式音乐请提供商用授权。

分享封面在 **public/share-cover.jpg**。替换同名文件并更新 share.title、description、siteUrl；生产 siteUrl 必须填写完整 HTTPS 地址，构建时会生成绝对 og:image、og:url 和 canonical。HTML 元数据由同一配置生成，不需要手改 index.html。Demo 封面为代码生成图形，含 V1 DEMO 字样，正式上线请替换。

## 项目结构

```text
src/config/invitation.ts     集中内容配置
src/components/              黑胶、图片、动画、音乐
src/App.tsx                  六章节和照片弹窗
src/styles.css               响应式、Safe Area、动画
public/assets/images/        Logo、SVG 占位插画、纸张噪点
public/assets/audio/         本地音乐
public/share-cover.jpg       微信分享封面预留
scripts/                    Demo 素材生成、图片压缩
tests/                      浏览器自动化验收
docs/                       素材清单、部署和微信说明
```

使用 100dvh 容器与 100svh 章节、safe-area-inset、CSS scroll-snap proximity；短手机可在章节内滚动，不裁切内容。支持章节导航、键盘操作和 prefers-reduced-motion。不支持 JS 的浏览器展示提示。

## 构建与部署

`npm run build` 输出 **dist/**。可把 dist 全部内容上传到支持 HTTPS 的静态托管（Nginx、腾讯云/阿里云对象存储加 CDN、Cloudflare Pages 等）。此项目只有根页面，不需要 SPA 路由回退。Vite base 为 ./，可部署域名根路径或子目录；不要只上传 index.html。`npm run preview` 仅验证构建结果，不是生产服务器。

上线步骤：确定域名和 HTTPS → 配置 share.siteUrl → 替换真实素材和活动信息 → lint/typecheck/test/build → 上传 dist → 检查根页面、图片、音频和分享封面 → 用微信/iOS/Android 实机验证并发送链接。中国大陆服务器和自有域名可能涉及备案，以托管商要求为准。

如当前目录有 .openai/hosting.json，表示已注册 Sites 部署身份；使用 Sites 插件管理发布。它不影响标准 Vite 构建或迁移到其他静态托管，不要提交 token/secret。

## 微信分享

普通 HTTPS 网页能在微信内打开，与“自定义微信分享卡片”是两件事。基础 title/description/OG 已设置，**没有接入或伪造微信公众号/JSSDK 能力**。如需稳定的微信自定义卡片，请阅读 [微信部署说明](docs/WECHAT_DEPLOYMENT.md)，需客户提供合适公众号、域名及服务端签名条件。公众号密钥禁止写入前端。没有这些条件也能正常浏览、播放音乐、分享普通链接。

## 正式交付前

当前日期、时间、地点、地址、联系人和电话均为待定；导航和电话按钮禁用，填入 event.navigationUrl/phone 后自动启用。Logo 为唱片占位标记，环境/江景/舞台是原创 SVG 占位插画，并非酒吧实拍。

请按 [客户素材清单](docs/ASSETS_REQUIRED.md) 提供正式素材和最终文案。2026-10-20 前还需客户确认风格、核实活动信息，完成真实手机/微信分享及音频验证。
