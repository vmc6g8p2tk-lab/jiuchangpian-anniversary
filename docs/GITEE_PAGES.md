# Gitee 仓库与子路径部署

目标仓库：https://gitee.com/handsijj/jiuchangpian-anniversary.git

默认使用 master 分支。仓库保存源码、package-lock.json、Demo 素材及文档；不提交 node_modules、dist、环境文件、凭据、测试截图和本地缓存。

## 构建

```bash
npm install
npm run build
npm run test:deployment
```

输出在 dist/。test:deployment 使用已安装的 Chrome，将真正构建好的 dist 挂载在 `/jiuchangpian-anniversary/`，检查 JS、CSS、图片、音频、分享封面、颗粒背景和章节，不能用开发服务器通过代替该验证。

vite.config.ts 保留 `base: './'`：HTML 中 JS/CSS 为相对路径；组件图片、Logo、音频使用 import.meta.env.BASE_URL；CSS 中 public 资源由 Vite 处理为构建后相对地址。这样同一份 dist 可部署到 `/jiuchangpian-anniversary/`，也保留原有域名根目录部署能力。

目录 URL 应以 `/` 结尾；无尾斜杠时托管服务器应重定向到目录 URL。部署时上传整个 dist 的内容，并让 index.html 位于实际发布目录的首页位置，不能只上传源码或仅上传 index.html。

## 发布边界

推送到 Gitee 仓库不等于已开通或发布 Pages。具体托管功能、部署目录、域名及 HTTPS 以账号控制台实际提供的功能为准；本项目提供标准静态构建产物，不依赖某一家托管平台。

获得最终页面地址后，修改 src/config/invitation.ts 的 share.siteUrl 为真实 HTTPS URL（包含 `/jiuchangpian-anniversary/` 子路径，如适用），重新 build 再发布；当前配置仍指向已发布的 Sites Demo，没有虚构 Gitee Pages 地址。此项影响分享元数据和 canonical，不影响本地 JS/CSS 的相对资源路径。

Gitee 登录、密码或私人令牌只通过本人的 Git 凭据管理器/受信任登录窗口完成；不要写入远程 URL、源码、环境文件或提交历史。
