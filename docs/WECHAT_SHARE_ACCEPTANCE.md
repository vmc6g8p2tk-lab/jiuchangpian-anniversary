# 微信聊天链接分享预览优化验收报告

验收日期：2026年10月19日。项目：D:\codex项目\old-record-invitation。

**状态：本地修改完成；普通及 GitHub Pages 构建通过；本轮未 commit、未 push、未部署；微信图文卡片未实测，不能保证出现。**

## A. 已完成内容

- 初始检查：master，HEAD 为 b97094cd759f475bdef64f07616339f3437da58b，工作区无未提交源码改动。既有被忽略的截图/原片保留。
- GitHub remote 为 github，Gitee remote 为 origin，两者均未修改；现有 GitHub Actions 工作流未修改。
- 实际项目为七屏，含后来新增的活动详情页。为保护现有项目，本轮保留全部七屏，没有删成六屏。
- App.tsx、组件、动画、音乐逻辑、样式、照片、客户 Logo、地图按钮和正式网址均未改动。
- 分享信息集中在 src/config/invitation.ts；Vite 在构建阶段写入初始 HTML，运行 React 前即已存在。
- title、description、canonical、og:title、og:description、og:type、og:url、og:image、og:image:secure_url、og:image:width/height/alt、og:site_name、twitter:card/title/description/image 均检查；额外保留 og:locale、og:image:type。
- canonical、og:url、各分享图片地址均采用 HTTPS 绝对地址；GitHub 资源基础路径仍为 /jiuchangpian-anniversary/。
- 所需标签没有重复或冲突，favicon 保持既有黑胶 SVG，发布产物中路径正确。
- 没有接入 JS-SDK、AppID、签名服务或私人密钥；没有购买服务。

分享标题：旧唱片｜1周年庆电子邀请函

分享描述：10月28日 · 旧唱片一周年；诚邀你来赴一场关于音乐、旧唱片与江景的周年之约。

正式网址：https://vmc6g8p2tk-lab.github.io/jiuchangpian-anniversary/

## B. 正式封面和预览

- 正式文件：[public/share-cover-wechat.jpg](../public/share-cover-wechat.jpg)。JPEG，1200×630，153600字节。
- 构建文件：dist/share-cover-wechat.jpg，与正式源文件内容一致。
- 未来发布地址：https://vmc6g8p2tk-lab.github.io/jiuchangpian-anniversary/share-cover-wechat.jpg 。**本轮未上传，目前不能视为已上线图片。**
- 深棕黑色背景、黑胶、暗红唱片封套、暖金细节。主标题“旧唱片”、副标题“1周年庆电子邀请函”、日期“10月28日”。
- 客户已提供的原版 Logo 仅按原比例展示；其源文件没有修改。不使用参考作品素材，不编造照片或 Logo。
- 核心信息区域限制在中央630×630（x=285至915）。完整图和315/160/96px方形缩略图已人工查看，中文无乱码；极小缩略图的细字可读性受显示尺寸限制。
- [裁切和缩略图总览](../artifacts/wechat-share-review/cover-review.png)
- [中央方形裁切](../artifacts/wechat-share-review/cover-square-315.png)
- [160px缩略图](../artifacts/wechat-share-review/cover-square-160.png)
- [96px缩略图](../artifacts/wechat-share-review/cover-square-96.png)
- 预览和 HTML 排版源在 artifacts/wechat-share-review/，继续被 Git 忽略，不进入发布目录。旧 share-cover-v2.jpg、share-cover.jpg 保留原样。

## C. 修改文件清单

| 文件 | 用途 |
|---|---|
| src/config/invitation.ts | 按本次指定修改分享标题、描述、图片和 alt，增加封面副标题 |
| index.html | 补充 og:image:secure_url |
| public/share-cover-wechat.jpg | 新正式 JPEG 封面，使用新文件名区分旧缓存 |
| scripts/generate-share-cover.mjs | 生成正式封面、中央安全区域和缩略图验收图；不覆盖旧图 |
| scripts/verify-share-metadata.mjs | 直接读取原始构建 HTML，检查标签唯一性、路径和图片规格 |
| scripts/verify-subpath.mjs | 同步新分享配置，增加 secure_url 验证 |
| tests/invitation.spec.ts | 更新分享预期并增加禁用网页 JavaScript 的验证，保留原回归检查 |
| package.json | 增加 assets:share、test:share 命令，无新增项目依赖 |
| README.md | 更新分享图维护与验收命令 |
| docs/WECHAT_DEPLOYMENT.md | 本轮发布边界、真机操作与记录表 |
| docs/WECHAT_SHARE_ACCEPTANCE.md | 本报告 |

package-lock.json、vite.config.ts、部署工作流、应用布局/交互代码均保持原样。

## D. 实际构建及测试结果

| 命令/检查 | 结果 |
|---|---|
| npm run assets:share | 通过；生成1200×630 JPEG及裁切预览，检查客户 Logo 原文件未变 |
| npm run lint | 通过 |
| npm run typecheck | 通过 |
| npm run build（普通相对路径） | 通过 |
| npm run test:share（普通产物） | 通过；直接检查原始 head 中16项唯一 meta、title、canonical、favicon和图片 |
| npm run test:deployment（普通构建，挂载/jiuchangpian-anniversary/） | 通过 |
| VERIFY_MOUNT_PATH=/relative-path-check/，npm run test:deployment | 通过；验证Gitee相对路径能力，不假定实际Gitee网址 |
| DEPLOY_BASE_PATH=/jiuchangpian-anniversary/，DEPLOY_SITE_URL=正式网址，npm run build | 通过 |
| GitHub构建，npm run test:share | 通过；favicon及入口资源带正确子路径 |
| GitHub构建，npm run test:deployment | 通过；页面、JS/CSS、Logo、照片、音频、封面等无404及项目Console错误 |
| npm run test（Playwright） | 18项全部通过；包含原17项回归和新增“禁用JavaScript仍有分享标签” |
| git diff --check | 通过；仅正常的Windows换行提示 |

Playwright覆盖375×667、390×844、430×844、390×667，七屏、首屏感恩文案、章节切换、照片灯箱、1/3/5张数组、正式7张照片、音乐续播与拒绝播放、图片失败、减少动画、Logo完整性等。

最后保留的 dist 为 GitHub Pages 目标构建，可在本地预览正式子路径，但没有上传。

### 公网HTTP检查（本轮只读）

- 正式页面：HTTP 200，仍显示此前已上线的标题“旧唱片｜1周年·感恩有你”。
- 该线上 HTML 当前引用的 JS、CSS、favicon、share-cover-v2.jpg：均 HTTP 200。
- 新 share-cover-wechat.jpg：HTTP 404，**因为本轮按要求没有部署，这是预期的待发布状态，不是本地构建资源故障。**
- HTTP检查明细：artifacts/wechat-share-review/live-http-status.json。

## E. 已验证、未验证及无法保证

已验证：本地静态 head 完整且无需网页JavaScript；正式新图为正确JPEG；HTTPS/基础路径正确；标签不重复；现有功能回归通过；当前线上旧版本可访问。

未验证：本轮新 HTML/新图的公网发布（未执行）；iPhone/Android微信真实聊天预览；微信菜单转发结果及平台缓存；实际Gitee网页地址。

无法保证：微信一定把裸链接转换为图文卡片；一定使用OG缩略图或描述；朋友圈和好友聊天呈现一致。网页元数据只能提供提取信息，最终展示由微信决定。

## F. 你下一步需要执行的最少操作

1. 先确认本报告中的封面和指定分享文案；本轮已停止，等待你另行授权发布。
2. 发布后，在iPhone、Android微信分别做两条测试路径：聊天中粘贴正式网址并发送；微信内打开网站后，右上角菜单发送给朋友。
3. 按 docs/WECHAT_DEPLOYMENT.md 记录标题、简介、缩略图及接收端截图。只有真实客户端证据才能标记微信分享成功。
4. 若仍是普通网址，属于平台提取/缓存/权限等可能限制；下一阶段可评估具备相应分享接口权限的公众号、JS接口安全域名和可信服务端签名服务，不将AppSecret放前端，也不假造SDK成功。

没有自动提交、推送、部署、修改remote或购买服务。
