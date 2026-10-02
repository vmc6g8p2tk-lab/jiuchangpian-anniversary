# V2 本地验收记录

验证日期：2026-10-02。当前分支 master，基于 f470976。没有 commit、push、remote 修改或新线上发布。GitHub V1 已部署且用户人工确认正常；本轮不将该结论延伸为 V2 已上线。

## 已实现

- 正式网页店名“旧唱片”，首页、票根、结尾统一“10 月 28 日”。交付按2026年10月21日前规划。
- 客户原版白色透明 Logo，1133×230，完整保留；public/assets/images/brand-logo.png 与 client-reference/logo-original.png SHA256 相同：639A72E65782FBB6584089B8C2E10A66515901EFBBBB656F380BFAC150FE2A78。
- BrandLogo 统一三个区域，等比例、无反色、无圆形裁切，浅色页使用深色底牌。原标志内部的长名称按客户原样保留；网页/SEO/分享文字统一为新店名。
- 视频约99.59秒，1280×720，分时读取30个关键帧；采用黑胶、暗木、琥珀暖光、暗红、照片档案与江景夜色的视觉语言。未使用视频音乐、水印、原片或第三方图像。
- 六章保留原有故事与交互，升级封套/内页/档案/海报/票根/黑胶收尾。
- 1/3/5张相册，按钮和键盘按实际数量循环；关闭灯箱返回原焦点。
- 活动列表显式暂定；时间、地址、联系人、电话、导航统一待确认，不生成假链接。
- 音乐单实例、播放失败降级、减少动态效果、懒加载、Safe Area 与 dvh/svh 保留。
- 新分享图 share-cover-v2.jpg，1200×630，中央安全区；旧 share-cover.jpg 同步更新。
- 完整 HTML/OG/Twitter元数据及HTTPS绝对图片URL；本轮没有微信JS-SDK。
- Demo生成器仅写demo-generated/，不覆盖已有文件或public正式素材。

## 实际本地验证

| 检查 | 结果 |
|---|---|
| npm ci | 成功 |
| npm run lint | 通过 |
| npm run typecheck | 通过 |
| 普通 npm run build，base=./ | 通过 |
| 普通静态挂载 / | 通过 |
| 普通静态挂载 /relative-path-check/ | 通过；这是模拟子路径，不是Gitee线上地址 |
| GitHub build，base=/jiuchangpian-anniversary/ | 通过 |
| GitHub 静态子路径验证 | 通过 |
| Playwright | 12项全部通过 |
| 手机视口 | 375×667、390×844、430×844、390×667，无横向溢出，首屏按钮完整可见 |
| 相册 | 1、3、5张循环与焦点返回通过 |
| 音乐 | 开启、暂停、续播、切章位置保持、拒绝播放降级通过 |
| 图片失败 | 显示降级文案且章节切换正常 |
| Logo | 图片比例、无filter、原图哈希通过 |
| 元数据 | 独立硬断言品牌、日期、完整meta、HTTPS图URL与尺寸通过 |
| Console/pageerror | 无项目错误；已确认的本机Kaspersky外部注入源在测试中返回空脚本，未过滤项目错误 |
| Demo脚本保护 | 连续运行两次，全部public文件SHA256不变 |
| GitHub workflow | 原文件未修改 |
| git diff --check | 无空白错误 |

最新GitHub构建：JS约368.59KB / gzip117.99KB，CSS约29.46KB / gzip7.54KB。没有增加整套中文字体、大型UI库或首屏视频。

截图：artifacts/v2/01-cover.png、02-story.png、03-gallery.png、04-event.png、05-invitation.png、06-ending.png、mobile-375.png、mobile-390.png、mobile-430.png；另有各宽度/短屏逐章截图。记录是Chrome视口验证，不代表微信/iOS真机验证。

## 未验证 / 待客户提供

- 本轮V2未发布到公网；新图URL是构建目标地址，未证明公网抓取或微信卡片成功。
- Gitee实际页面URL未提供，只验证相对资源构建兼容；正式canonical及分享URL需真实地址覆盖。
- 正式环境/驻唱/江景照片、音乐、时间、地址、联系人、电话、地图位置和活动最终确认仍缺失。
- iPhone/Android微信、Safari/Chrome真机：字体、Safe Area、地址栏变化、触控、后台恢复、音频限制、电话导航、弱网、中国大陆网络访问。
- 微信朋友/朋友圈/粘贴链接分别验证预览和缓存。HTML/OG/Twitter不能保证微信卡片显示，本轮不接SDK。
- 客户确认原版组合Logo与正式短店名的使用关系、分享封面和最终邀请文案。

## 交付时 Git 状态

未暂存、未提交。stat 不计入未跟踪新增文件。

```text
 M .gitignore
 M README.md
 M docs/ASSETS_REQUIRED.md
 M docs/GITEE_PAGES.md
 M docs/GITHUB_PAGES.md
 M docs/WECHAT_DEPLOYMENT.md
 M index.html
 M playwright.config.ts
 M public/share-cover.jpg
 M scripts/generate-demo-assets.mjs
 M scripts/verify-subpath.mjs
 M src/App.tsx
 M src/config/invitation.ts
 M src/styles.css
 M tests/invitation.spec.ts
 M vite.config.ts
?? docs/V2_ACCEPTANCE.md
?? public/assets/images/brand-logo.png
?? public/share-cover-v2.jpg
?? scripts/generate-share-cover.mjs
?? src/components/BrandLogo.tsx
?? src/components/GalleryArchive.tsx
?? src/components/PhotoLightbox.tsx
?? tests/fixtures/
```

```text
 .gitignore                       |   4 ++
 README.md                        |  78 +++++++++++++-----------
 docs/ASSETS_REQUIRED.md          |  40 ++++++-------
 docs/GITEE_PAGES.md              |  11 +++-
 docs/GITHUB_PAGES.md             |  22 +++----
 docs/WECHAT_DEPLOYMENT.md        |  15 ++++-
 index.html                       |  13 +++-
 playwright.config.ts             |   5 +-
 public/share-cover.jpg           | Bin 39823 -> 68563 bytes
 scripts/generate-demo-assets.mjs |  13 ++--
 scripts/verify-subpath.mjs       |  49 +++++++++++----
 src/App.tsx                      |  41 ++++---------
 src/config/invitation.ts         |  16 ++---
 src/styles.css                   | 125 ++++++++++++++++++++++++++++++++++++++-
 tests/invitation.spec.ts         | 103 ++++++++++++++++++++++++++++++--
 vite.config.ts                   |   8 +++
 16 files changed, 404 insertions(+), 139 deletions(-)
```
