# 正式交付前客户素材清单

项目：旧唱片江景民谣 · 一周年庆。目标交付：2026-10-20；活动日期尚未确定。

| 素材 / 信息 | 建议要求 | 替换位置 |
| --- | --- | --- |
| 1. 酒吧 Logo | 透明背景 PNG 或 SVG，确认商用权 | brand.logo |
| 2. 5–10张高清酒吧环境照片 | 原图，精选3张用于 V1，相册可扩展 | gallery.photos |
| 3. 驻唱 / 演出照片 | 确认摄影及人物使用授权 | story.photo、gallery.photos |
| 4. 江景照片（如果有） | 黄昏或夜景，横向优先 | gallery.photos |
| 5. 周年庆日期 | 年月日 / 星期 | event.date |
| 6. 开始时间 | 开场、演出、结束时间 | event.time |
| 7. 酒吧详细地址 | 城市、街道、楼层及可分享的地图导航链接 | event.venue/address/navigationUrl |
| 8. 联系人 | 可对客户公开的姓名 / 称呼 | event.contact |
| 9. 联系电话 | 可公开手机或座机号码 | event.phone |
| 10. 周年庆活动内容 | 最终节目、酒饮、惊喜、是否需要预约 | celebration.items |
| 11. 最终邀请文案 | 封面、品牌故事、邀请、结尾 | cover/story/event/ending |
| 12. 背景音乐文件 | 获得商用授权的 MP3/AAC，建议128kbps | music.src |
| 13. 微信分享封面 | 建议1200×630，主体居中并兼顾正方形裁切；另提供分享标题描述 | public/share-cover.jpg、share |
| 14. 客户喜欢的参考H5 | 1–3个网页链接，标注喜欢的细节 | 风格确认参考 |

所有字段在 src/config/invitation.ts，文件素材在 public/assets/。收到正式照片后清空对应 placeholder 字段。当前 Demo 的酒吧、江景、演出图片是原创 SVG 示意图；音频是原创数学合成氛围。不要将它们表述成酒吧真实照片、真实演出或正式曲目。

微信自定义卡片还需公众号、域名及签名服务条件，见 WECHAT_DEPLOYMENT.md。建议先确认 V1 风格，再锁定素材和信息，最后做实机及分享验收。
