# 旧唱片｜1周年·感恩有你 V2

当前视觉保留原唱片纪念册版面：大型黑胶、唱针、照片档案与票券；首屏突出“1周年·感恩有你”，不以邀请函开场。全册采用泛黄报纸底色、静态纤维与边缘裂纹，样式集中在 src/styles.css。客户 Logo 和实景照片不加滤镜，活动信息保持集中配置。

Vite + React + TypeScript + CSS + Framer Motion。七章：感恩黑胶封套、纪念内页、照片档案、特别之夜、周年活动详情、入场券、黑胶收尾。周年日期10月28日；按2026年10月21日前交付规划，10月20日内部发布检查。

## 安装与运行

建议 Node.js 24；支持 Vite 要求的20.19+ / 22.12+。

```bash
npm install
npm run dev
```

默认 http://localhost:5173/。本次 V2 预览使用 http://localhost:5174/，避免占用旧预览。同一局域网手机可使用终端 Network 地址，访问还取决于网络和防火墙。

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
npm run preview
```

Playwright 使用本机 Chrome，默认在5174启动或复用本项目服务，可用 PLAYWRIGHT_PORT 修改。没有 Chrome 时安装 Chrome，或删除 channel 并安装 Playwright Chromium。测试报告在 playwright-report/，截图在 artifacts/v2/。本机安全软件注入 Kaspersky 脚本，测试仅隔离该已确认的外部源，不过滤项目错误。tests/fixtures/ 是独立相册测试入口，不进入生产 dist。

## 文字、时间和地点

所有业务内容在 src/config/invitation.ts：brand、cover、story、gallery、celebration、activities、event、ending、music、share、ui。店名“旧唱片”；event.date 统一提供首页、票根和结尾日期。开始时间21:00，地点旧唱片江景民谣四楼，地址长沙市岳麓区渔人码头2栋。仅保留地图导航，不显示联系人和电话。导航按配置地址打开高德地图搜索（未猜测坐标）；navigationUrl 为空时禁用导航按钮。当前 celebration.pending=false，按客户要求移除活动暂定提示；需要恢复时可在配置中开启。活动日期和交付日期分别管理，不猜测星期。

## Logo、照片、音乐

客户原图和视频保留本地 client-reference/，已 Git 忽略且不进入 dist。public/assets/images/brand-logo.png 是1133×230白色透明 PNG，原图完整保留，无裁切、改字、改色、反色或重绘。原图内部含“旧唱片江景民谣”，属于客户原版组合标志，不能按旧品牌搜索擅自改字；网页店名仍为“旧唱片”。浅色页用深色底牌，白字不消失。

BrandLogo 用于顶部、首页和结尾；按原唱片封套版面展示客户原 Logo。替换 brand.logo 的 src、alt、width、height；根据新原图检查背景，不添加 invert、圆形裁切或正方形强制尺寸。

照片放 public/assets/images/，修改 gallery.photos 的 src、alt、caption；正式照片到位后清空 placeholder。故事照片使用 story.photo。当前已接入7张客户提供的酒吧、江景及演出照片。相册使用等宽双列排版，奇数末张等宽居中，保留点击放大；按数组长度处理，已验证1/3/5/7张，更多照片自然延长章节，短屏可滚动阅读完整说明。

建议图片1200px内、150–250KB。运行 `node scripts/optimize-images.mjs`，配置 webp/avif，picture 保留原图回退；图片 lazy loading，不使用大图 base64。

音乐放 public/assets/audio/，修改 music.src、volume、playbackRate、enabled、autoplay 和 credit。当前接入 Jason Shaw / Audionautix 的《Solo Acoustic #3》，按 CC BY 4.0 署名授权用于商业 H5；结尾保留来源和许可链接，授权记录见 [docs/MUSIC_LICENSE.md](docs/MUSIC_LICENSE.md)。原作者 MP3 本地托管，旧 background.wav Demo 不再引用。当前 playbackRate=0.95，慢5%并请求保留音高，不修改原MP3；调整倍率同步更新credit.playbackNote。autoplay=true 时同时设置原生 autoplay 并在进入页面主动尝试播放，微信宿主就绪时补充一次尝试。浏览器允许时无须点击其他按钮即可出声；被拒绝后关闭原生自动重试并显示提示，首次触碰页面或点击音乐按钮可重试。手动暂停同样关闭原生自动重试，翻页、首页开启按钮和微信就绪事件不会抢播，只有主动点击唱片恢复。切章不重播，暂停续播保留位置，失败不阻断浏览。不保证所有微信/iOS允许零操作自动出声。换曲需同步核验授权和更新署名。

## 分享图和微信

本轮静态分享封面为 public/share-cover-wechat.jpg（1200×630 JPEG），深色黑胶与暖金唱片封套风格，中央630×630区域保留 Logo、旧唱片、1周年庆电子邀请函及10月28日。运行 `npm run assets:share` 可重新生成封面与 artifacts/wechat-share-review/ 中的裁切预览，不覆盖旧 share-cover-v2.jpg/share-cover.jpg。Demo 生成器只写 demo-generated/，绝不覆盖已有文件或 public 正式素材。

Vite 在初始 HTML 中根据 share 生成 title、description、canonical、完整 OG（含 og:image:secure_url）和 Twitter Card；执行 `npm run build` 后运行 `npm run test:share` 验证原始构建 HTML 无重复、无占位符，图片路径和尺寸正确。默认 siteUrl 使用已有 GitHub 页面；Gitee 发布时用真实 DEPLOY_SITE_URL 覆盖，仓库 URL 不是网页 URL。分享图必须为公网 HTTPS 绝对地址。

本轮仅 HTML/OG/Twitter，没有微信 JS-SDK，不能保证微信一定显示卡片。朋友、朋友圈、粘贴链接分别真机验证。详见 docs/WECHAT_DEPLOYMENT.md。

## 构建和双平台部署

普通 `npm run build` 使用 base='./'，上传整个 dist/ 到 HTTPS 静态托管。目录 URL 应以 / 结尾。本项目仅章节 hash，无需多路由回退。preview 是本地验证，不是公网发布。

GitHub master 工作流保留，设置 DEPLOY_BASE_PATH=/jiuchangpian-anniversary/ 和 DEPLOY_SITE_URL=https://vmc6g8p2tk-lab.github.io/jiuchangpian-anniversary/ 。前者控制资源路径，后者控制 canonical、og:url、绝对分享图。不能把 GitHub 固定子路径产物直接用于不同 Gitee 路径。

普通构建验证（PowerShell）：

```powershell
npm run build
$env:VERIFY_MOUNT_PATH='/'
npm run test:deployment
$env:VERIFY_MOUNT_PATH='/relative-path-check/'
npm run test:deployment
```

GitHub 构建验证：

```powershell
$env:DEPLOY_BASE_PATH='/jiuchangpian-anniversary/'
$env:DEPLOY_SITE_URL='https://vmc6g8p2tk-lab.github.io/jiuchangpian-anniversary/'
$env:VERIFY_MOUNT_PATH='/jiuchangpian-anniversary/'
npm run build
npm run test:deployment
```

恢复普通构建，移除两个 DEPLOY 环境变量，再 build。VERIFY_MOUNT_PATH 仅控制测试挂载。/relative-path-check/ 是本地兼容验证路径，不是猜测的 Gitee 地址。Gitee 真实 URL 仍需提供。见 docs/GITEE_PAGES.md、docs/GITHUB_PAGES.md。

## 正式交付前

已收到并接入7张客户实景照片；仍缺授权音乐、最终文案和分享封面确认；特别之夜四项已按客户反馈调整，活动暂定提示已移除。时间、地点和地址已确认；联系人与电话按客户要求移除。客户素材清单见 docs/ASSETS_REQUIRED.md。历史 V1 验收保留 docs/ACCEPTANCE.md，V2 记录 docs/V2_ACCEPTANCE.md。代码完成、本地验证、线上验证分开记录。2026年10月19日用户已授权上线，按现有 GitHub Pages 工作流提交、推送并部署；不修改 remote，发布结果以 Actions 及线上页面核验为准。

本轮分享优化仅完成本地修改与验收，尚未提交或发布；线上继续使用之前版本。完整报告见 docs/WECHAT_SHARE_ACCEPTANCE.md，微信真机测试步骤见 docs/WECHAT_DEPLOYMENT.md。
