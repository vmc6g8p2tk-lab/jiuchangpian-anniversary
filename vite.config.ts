import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { invitation } from './src/config/invitation'

const escape = (text: string) => text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
// 部署环境覆盖地址；不修改邀请函内容配置，普通构建仍兼容 Gitee / Sites。
const deploymentBase = process.env.DEPLOY_BASE_PATH || './'
const deploymentSiteUrl = process.env.DEPLOY_SITE_URL || invitation.share.siteUrl
export default defineConfig({
  // GitHub Actions 指定 /jiuchangpian-anniversary/；本地及 Gitee 默认相对路径。
  base: deploymentBase,
  plugins: [react(), {
    name: 'invitation-metadata',
    transformIndexHtml(html) {
      return html.replaceAll('__TITLE__', escape(invitation.share.title))
        .replaceAll('__DESCRIPTION__', escape(invitation.share.description))
        .replaceAll('__SHARE_IMAGE__', escape(deploymentSiteUrl ? new URL(invitation.share.image, deploymentSiteUrl).href : invitation.share.image))
        .replace('__CANONICAL__', deploymentSiteUrl ? `<link rel="canonical" href="${escape(deploymentSiteUrl)}" /><meta property="og:url" content="${escape(deploymentSiteUrl)}" />` : '')
    },
  }],
})
