# V1 验收记录

验证日期：2026-10-01。本机 Node.js 24，Chrome 自动化，375×667、390×844、430×844。

- [x] 六屏完整，统一纸张/黑胶/票根视觉，六章导航与上下滚动可用。
- [x] 三种宽度无横向溢出；375×667 首屏开启按钮完整可见。
- [x] CSS 黑胶慢速旋转、唱针、周年数字渐入、逐行文案、照片浮现、轻微滚动视差。
- [x] 本地音乐用户点击后播放；暂停停止按钮旋转；切章不重播，恢复保留位置。
- [x] 模拟 NotAllowedError 音乐拒绝播放仍可浏览，未产生 pageerror。
- [x] 图片可点击放大、前后查看、Escape 关闭及键盘焦点约束。
- [x] 集中配置文字、照片、Logo、音乐、活动信息、分享元数据。
- [x] 图片 lazy loading、picture 的 WebP/AVIF 入口及压缩脚本。
- [x] Safe Area、dvh/svh、短屏自然滚动、prefers-reduced-motion 关闭持续动画及视差。
- [x] npm run lint 无错误/警告，npm run typecheck 通过，npm run build 通过。
- [x] npm run test：6 项通过；正常页面测试无 Console error 或 pageerror。
- [x] npm install 成功；更新 sharp 后安装审计为 0 vulnerabilities。
- [x] 中文 README、客户素材清单、微信部署文档齐全。
- [x] 基础 title/description/OG 和 share-cover.jpg；无伪造 JSSDK 或公众号能力。
- [ ] 真实 iPhone Safari / Android / 微信内核实机最终验收：等待手机打开公开链接。
- [ ] 正式照片、Logo、活动时间地点及商用音乐：等待客户提供。
- [ ] 自定义微信分享卡片：客户账号、域名和签名服务确认后再集成及验证。

自动化截图位于 artifacts/，测试 HTML 报告位于 playwright-report/（均不随源码发布）。不把 Chrome 手机视口验证表述为已经通过真实微信/iOS 设备测试。
