# 微信打开、分享与本轮本地验收

正式网址：https://vmc6g8p2tk-lab.github.io/jiuchangpian-anniversary/

## 本轮范围和状态

本轮仅优化静态分享元信息和正式封面，不接微信JS-SDK，不新增公众号配置或后端。当前已上线版本为之前的b97094c；本轮新标签和图片只在本地构建产物中，未commit、push或部署。不能把网页HTTP 200视为本轮已发布，更不能据此认定微信卡片成功。

本轮标题：旧唱片｜1周年庆电子邀请函

本轮描述：10月28日 · 旧唱片一周年；诚邀你来赴一场关于音乐、旧唱片与江景的周年之约。

新封面：public/share-cover-wechat.jpg（1200×630 JPEG）。目标URL为 https://vmc6g8p2tk-lab.github.io/jiuchangpian-anniversary/share-cover-wechat.jpg ，发布前该URL尚不可用。旧分享图保持原样。

分享配置集中在 src/config/invitation.ts。Vite在初始HTML head中生成title、description、canonical、Open Graph（含og:image:secure_url）及Twitter Card，图片使用HTTPS绝对URL。`npm run build`之后执行`npm run test:share`可直接验证原始HTML，不依赖React或页面JavaScript。

**微信是否把网址展示成卡片由微信决定，HTML/OG/Twitter标签不能保证成功。** 当前没有调用微信分享接口，也没有伪造AppID、签名或“wx.ready成功”。

## 发布后手机微信测试（最少操作）

分别使用iPhone和Android。记录机型、微信版本、日期，并保留发送端和接收端截图。

1. 在聊天中粘贴正式网址并发送，不仅观察输入框，也观察发送后的接收端消息。
2. 在微信内打开正式网址，等待页面出现后，右上角“···”→“发送给朋友”，再次查看接收端消息。
3. 逐项记录：是否仍为普通网址、是否出现标题、简介、缩略图、点击后是否打开正确页面。若平台不显示简介，按实际记录，不能补记为成功。
4. 可补测朋友圈，但它与好友聊天展示形式不同，不能互相代替验收。

| 设备 | 测试路径 | 展示形式 | 标题 | 简介 | 缩略图 | 点击打开 | 截图 |
|---|---|---|---|---|---|---|---|
| iPhone | 粘贴网址发送 | 未实测 | 未实测 | 未实测 | 未实测 | 未实测 | 待提供 |
| iPhone | 网页右上角发送 | 未实测 | 未实测 | 未实测 | 未实测 | 未实测 | 待提供 |
| Android | 粘贴网址发送 | 未实测 | 未实测 | 未实测 | 未实测 | 未实测 | 待提供 |
| Android | 网页右上角发送 | 未实测 | 未实测 | 未实测 | 未实测 | 未实测 | 待提供 |

当前没有上述真实微信测试证据，微信卡片状态必须保持“未验证”。本地Chrome手机视口和禁用JavaScript测试不是真机微信测试。

## 若仍然显示普通网址

先检查发布后的初始HTML和封面是否确实更新、HTTPS图片是否无鉴权可抓取；微信提取方式和缓存可能影响结果，不能承诺固定刷新时间，也不能以重复加标签保证转换成卡片。保持正式网址不变。

如果需要进一步控制微信菜单分享内容，评估以下条件后再单独接入：

- 具备相应JS分享接口权限的公众号及管理员，实际权限以微信公众平台后台为准。
- 可配置并验证的JS接口安全域名、HTTPS正式站点；验证文件及备案等按平台/托管要求处理。
- 可信服务端获取和缓存access_token、jsapi_ticket，按页面URL生成签名；AppSecret只由受信任服务端保管，绝不放前端或Git。
- 正式接入后分别验证好友与朋友圈，保留失败降级，网页不因签名失败而无法浏览。

参考：[微信官方JS-SDK说明](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html)。本轮未启用该能力，也未购买任何第三方服务。

本地验收、修改清单和公网只读检查详见 [WECHAT_SHARE_ACCEPTANCE.md](WECHAT_SHARE_ACCEPTANCE.md)。
