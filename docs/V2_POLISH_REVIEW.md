# V2 最终视觉精修记录

日期：2026-10-02。保留现有六章结构、内容顺序、客户文案、Logo、参考素材限制及交互；未 commit、push、部署或修改 remote。

## 本轮修改

- src/styles.css：弱化首页 SIDE A、VOL.01、页码、星号与英文小字，保持核心 Logo/店名、1周年、日期与开启邀请；保留黑胶、唱针、票券、现有配色。弱化幅度是视觉判断，不声称做过“减少10%–15%”的量化测量。
- 首页 Logo 底牌与全局采用相同深色和边框，原 PNG、尺寸比例不改。浅色页继续深底，不反色。
- 主要章节标题统一到30px/1.5行高（封面品牌、周年数字和票根日期保留独立层级），辅助英文和页脚减弱，编号字距收紧。
- 相册阴影由5px/15px的悬浮感改为2px/5px浅阴影；编号、错落结构、待替换、说明、灯箱保留。
- 入场券信息改为两列Grid；标签字距收紧，值左边界统一，长地址允许换行。日期仍36px；时间/地址待确认，电话/地图仍禁用。四句邀请正文未改。
- tests/invitation.spec.ts：保留原测试严格程度，新增正文原样、长字段对齐、减少动画正文直接可读、照片不互相遮挡和固定Logo SHA256检查；生成review截图。
- scripts/verify-subpath.mjs：增加发布Logo哈希、参考资料/视频/测试入口泄漏、旧内容及本地路径检查。

本轮未改 src/App.tsx、集中配置、BrandLogo组件、正式Logo、正式分享图、GitHub workflow、.git/config。修改前后哈希已经核对。

## 命令及实际结果

| 命令 | 实际结果 |
|---|---|
| npm ci | 首次因旧预览占用esbuild遇到EPERM，停止原预览后解决 |
| npm ci --cache .cache/npm | 新缓存需要访问registry，受当前网络限制失败 |
| npm ci --offline | 使用既有缓存安装187包成功 |
| npm run lint | 通过 |
| npm run typecheck | 通过 |
| npm run build（无DEPLOY变量） | 通过，base=./ |
| VERIFY_MOUNT_PATH=/，npm run test:deployment | 通过 |
| VERIFY_MOUNT_PATH=/relative-path-check/，npm run test:deployment | 通过，模拟相对路径，不是Gitee真实URL |
| VERIFY_MOUNT_PATH=/jiuchangpian-anniversary/，普通构建test:deployment | 通过 |
| DEPLOY_BASE_PATH=/jiuchangpian-anniversary/，DEPLOY_SITE_URL=GitHub真实目标URL，npm run build | 通过 |
| GitHub构建，VERIFY_MOUNT_PATH=/jiuchangpian-anniversary/，npm run test:deployment | 通过 |
| npm run test | 15项全部通过，未放宽原有布局断言；Windows测试预览清理等待后仅停止本次明确PID的Vite/esbuild，测试进程正常退出0 |
| git diff --check | 通过，无空白错误 |

覆盖375×667、390×844、430×844、390×667；1/3/5张相册、正常音乐、暂停续播/切章不重播、拒绝播放、图片失败、完整分享meta、HTTPS图URL、减少动态效果。测试继续仅隔离已确认的本机Kaspersky外部注入源，项目错误仍检查。

## 分享图与review截图

share-cover-v2.jpg原文件保持不变。1200×630原图、320×168横向缩小、240×240/160×160中央裁切已实际生成review图并人工检查，名称、1周年与10月28日仍可辨认；不承诺OG一定产生微信卡片。

artifacts/v2-review/包含六章、四种视口逐章截图和share-review.png；原artifacts/v2/同步生成最新截图。review派生图不进入正式构建。

## Logo完整性

客户原图、public网页文件与dist发布文件在修改前/后均保持：

```text
639A72E65782FBB6584089B8C2E10A66515901EFBBBB656F380BFAC150FE2A78
```

原Logo含“旧唱片江景民谣”，是客户标志固有文字；保留原样。网页品牌仍旧唱片。

## 清理搜索结论

- V1 DEMO、旧Sites URL、旧分享描述、错误活动日期：正式配置及构建无残留。
- 旧长品牌：仅客户Logo固有像素、说明文档及禁止旧文本的测试断言合理保留；正式正文/分享文本不使用。
- 待定：仅负面测试断言，网页统一待确认；历史V1验收仍保留。
- 10月20日：README中的内部发布检查日期，非活动日期；交付为10月21日前，周年为10月28日。
- 假电话/地址：无；配置phone、contact、navigationUrl为空，地址/时间待确认，地点旧唱片。
- 参考视频路径/client-reference：仅忽略规则、说明和负面验证断言；dist没有参考目录、视频、本地微信缓存路径或测试入口。

## 未完成的外部事项

仍需正式环境/演出/江景照片、授权音乐、开始时间、详细地址、联系人、电话、地图位置和活动最终确认，以及实际Gitee页面URL。只验证相对路径兼容，不猜Gitee URL。

真机验收：iPhone/Android微信及Safari/Chrome字体、Safe Area、地址栏变化、触控、音乐限制、后台恢复、电话地图跳转、弱网和实际网络。朋友/朋友圈/粘贴链接分享与缓存分别验证。本轮不接SDK、不更新线上。

## 当前Git状态

以下包含之前V2未提交改动，stat不计未跟踪新增文件。

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
?? docs/V2_POLISH_REVIEW.md
?? public/assets/images/brand-logo.png
?? public/share-cover-v2.jpg
?? scripts/generate-share-cover.mjs
?? src/components/BrandLogo.tsx
?? src/components/GalleryArchive.tsx
?? src/components/PhotoLightbox.tsx
?? tests/fixtures/
```

```text
 .gitignore                       |   4 +
 README.md                        |  78 +++++++++---------
 docs/ASSETS_REQUIRED.md          |  40 +++++-----
 docs/GITEE_PAGES.md              |  11 ++-
 docs/GITHUB_PAGES.md             |  22 ++----
 docs/WECHAT_DEPLOYMENT.md        |  15 +++-
 index.html                       |  13 ++-
 playwright.config.ts             |   5 +-
 public/share-cover.jpg           | Bin 39823 -> 68563 bytes
 scripts/generate-demo-assets.mjs |  13 ++-
 scripts/verify-subpath.mjs       |  61 ++++++++++++---
 src/App.tsx                      |  41 +++-------
 src/config/invitation.ts         |  16 ++--
 src/styles.css                   | 139 ++++++++++++++++++++++++++++++++-
 tests/invitation.spec.ts         | 165 +++++++++++++++++++++++++++++++++++++--
 vite.config.ts                   |   8 ++
 16 files changed, 491 insertions(+), 140 deletions(-)
```
