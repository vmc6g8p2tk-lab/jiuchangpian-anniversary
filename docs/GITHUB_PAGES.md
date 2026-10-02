# GitHub Pages 自动部署

仓库：VMC6G8P2TK-Lab/jiuchangpian-anniversary，默认分支 master。

计划发布地址：https://vmc6g8p2tk-lab.github.io/jiuchangpian-anniversary/

此地址是部署目标，需工作流上传、执行成功后才表示页面已上线。

## 首次配置

在仓库 Settings → Pages → Build and deployment 中，将 Source 设置为 **GitHub Actions**。确认仓库允许 GitHub Actions，github-pages environment 的分支保护允许 master 部署。具体 Pages 可用性由仓库可见性和账户计划决定。

将 .github/workflows/deploy-pages.yml 随源码提交到 master。每次 push master 自动触发，亦可从 Actions 手动运行。无需在仓库写入私人令牌；使用 GitHub 自动生成的 GITHUB_TOKEN 和部署所需 OIDC 权限。

工作流使用固定版本的官方 Actions，依次 checkout → Node.js 24 → 配置 Pages → npm ci → npm run build → 上传 dist → 官方 deploy-pages 发布。设置 contents: read、pages: write、id-token: write，部署任务等待构建任务成功，并使用 github-pages environment 输出页面 URL。

## 部署路径与兼容性

GitHub 构建环境设置：

```text
DEPLOY_BASE_PATH=/jiuchangpian-anniversary/
DEPLOY_SITE_URL=https://vmc6g8p2tk-lab.github.io/jiuchangpian-anniversary/
```

vite.config.ts 使用前者设置 base，使用后者生成 canonical、og:url 和绝对分享封面地址；没有更改邀请函文字、照片配置和业务功能。图片/音频/Logo 使用 BASE_URL；favicon 使用 HTML BASE_URL 占位；颗粒背景为 Vite 处理的相对源文件引用。当前使用系统字体，不下载字体文件；新增字体应使用 CSS 相对 url 并让 Vite 处理。

未设置以上变量时仍为 base: './'，普通本地开发继续 http://localhost:5173/，Gitee 和已有 Sites 的普通构建继续兼容；Gitee 配置及文档保留。页面仅使用章节 hash，没有 SPA 多路径路由，无需 404.html 路由回退。

## 本地复现 GitHub 构建（PowerShell）

```powershell
npm ci
$env:DEPLOY_BASE_PATH='/jiuchangpian-anniversary/'
$env:DEPLOY_SITE_URL='https://vmc6g8p2tk-lab.github.io/jiuchangpian-anniversary/'
npm run build
npm run test:deployment
npm run preview
```

该预览访问终端端口下的 /jiuchangpian-anniversary/。test:deployment 需要已安装 Chrome，使用真实 dist 检查子路径、元数据、JS/CSS、照片、Logo、颗粒、封面、音频和六章节，不依赖 Vite 开发服务回退。

恢复普通本地/Gitee 构建时，在同一 PowerShell 执行：

```powershell
Remove-Item Env:DEPLOY_BASE_PATH,Env:DEPLOY_SITE_URL -ErrorAction SilentlyContinue
npm run build
```

## 由你执行提交与推送

当前 GitHub remote 名为 github，Gitee remote 名为 origin，不要将 origin 的 Gitee 地址误认为 GitHub。

```powershell
Set-Location 'D:/codex项目/old-record-invitation'
git add .github/workflows/deploy-pages.yml vite.config.ts index.html src/styles.css scripts/verify-subpath.mjs README.md docs/GITHUB_PAGES.md
git commit -m "Configure GitHub Pages deployment on master"
git push github master
```

首次运行后在 Actions 检查 build、deploy 两个任务，并打开真实 HTTPS 页面在微信/iPhone/Android 验收。仅本地构建通过不能证明仓库 Pages 设置、环境审批或线上部署已经成功。

官方参考：[GitHub 自定义 Pages 工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)、[Vite 静态部署说明](https://vite.dev/guide/static-deploy.html#github-pages)。
