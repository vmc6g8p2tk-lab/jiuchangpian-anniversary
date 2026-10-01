# 微信打开、分享与正式部署

## A. 普通网页链接

该项目输出静态 HTML/CSS/JS，无需公众号即可通过 HTTPS 链接在微信内打开。音乐从用户点击开启邀请或唱片按钮开始尝试播放，iOS/微信可能仍拒绝，浏览不受影响。点击右上角可再次尝试。用手机在微信里打开正式 URL 才能最终确认兼容性。

已有 HTML title、description、Open Graph title/description/image，分享封面 public/share-cover.jpg。**微信对普通网页的卡片提取并不保证遵循 OG，基础 meta 不等于已实现自定义微信卡片。** 当前没有 JSSDK、签名服务或公众号配置，没有调用微信分享接口。

## B. 自定义微信分享卡片的条件

客户应提供或协调：

1. 具备对应 JS 接口权限的公众号和管理员；具体账号类型、认证状态及接口资格以当前微信公众平台后台为准。
2. 正式 HTTPS 域名及托管，配置公众号 JS 接口安全域名；如需校验文件，按微信后台要求放在域名根目录。大陆部署的备案等以托管及平台要求为准。
3. AppID；AppSecret 只交给受信任服务端运维，绝不能写入 invitation.ts、静态 JS、Git 或构建产物。
4. 独立的可信签名服务，服务端获取和缓存 access_token、jsapi_ticket，用当前页面完整 URL（去掉 # 后的 fragment）生成 nonceStr、timestamp、signature。静态 H5 本身不能安全持有密钥生成签名。
5. 可公开访问的 HTTPS 分享图、最终分享标题/描述、正式链接，并确认分享图允许无鉴权抓取。

如客户需要此能力，再接入微信官方 JS-SDK：加载官方 SDK → 请求签名服务 → wx.config → 在 wx.ready 中按当前支持情况配置 updateAppMessageShareData 和 updateTimelineShareData → wx.error 做降级。这属于正式阶段的额外集成，当前 Demo 不包含服务器，也没有假称 wx.ready 成功。无需使用 JSSDK 实现音频用户手势播放。

## 上线操作

1. 替换正式文案、Logo、照片、授权音乐、封面，完善 event 数据及导航链接。
2. 填写 share.siteUrl 为实际 HTTPS 页面地址，重新构建。Vite 构建会把分享图转换为绝对 URL，同时写入 canonical/og:url。
3. 执行 npm run lint、npm run typecheck、npm run test、npm run build，上传整个 dist。自定义域名 HTTPS 证书必须有效。
4. 对图片和 JS 使用合理缓存，index.html 使用短缓存；替换音乐、图片时更换文件名避免老缓存。CDN 不应拦截微信资源请求。
5. 测试 iPhone Safari、Android Chrome、微信 iOS/Android：首次加载、地址栏展开收起、Safe Area、上下滑动、音乐播放/暂停/切章、返回后台再打开、照片加载、电话/导航、弱网和分享给朋友/朋友圈。
6. 分享预览可能有平台缓存；变更后重新打开真实页面和分享，必要时按微信当前支持方式更新缓存。

## 验证边界

本地自动化验证使用真实 Chrome 浏览器内核的手机视口，不能替代真实 iPhone Safari 或微信内核，也不能证明微信自定义卡片已经可用。正式上线要在客户公众号条件确认后验证 JSSDK；缺少条件时普通网页继续可用。

官方资料入口：[微信 JS-SDK 说明](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html)。以正式上线时微信官方说明和客户后台权限为准。
