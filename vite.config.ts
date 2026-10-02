import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { invitation } from './src/config/invitation'

const escape = (text: string) => text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
// 部署环境覆盖地址；不修改邀请函内容配置，普通构建仍兼容 Gitee / Sites。
const deploymentBase = process.env.DEPLOY_BASE_PATH || './'
const deploymentSiteUrl = process.env.DEPLOY_SITE_URL || invitation.share.siteUrl
const site = new URL(deploymentSiteUrl)
if (site.protocol !== 'https:' || !site.pathname.endsWith('/')) throw new Error('DEPLOY_SITE_URL 必须为以 / 结尾的 HTTPS 页面地址')
if (deploymentBase !== './' && (!deploymentBase.startsWith('/') || !deploymentBase.endsWith('/'))) throw new Error('DEPLOY_BASE_PATH 必须为 ./ 或以 / 开头和结尾的子路径')
export default defineConfig({
  // GitHub Actions 指定 /jiuchangpian-anniversary/；本地及 Gitee 默认相对路径。
  base: deploymentBase,
  plugins: [react(), {
    name: 'invitation-metadata',
    transformIndexHtml(html) {
      return html.replaceAll('__TITLE__', escape(invitation.share.title))
        .replaceAll('__DESCRIPTION__', escape(invitation.share.description))
        .replaceAll('__SHARE_IMAGE__', escape(deploymentSiteUrl ? new URL(invitation.share.image, deploymentSiteUrl).href : invitation.share.image))
        .replaceAll('__SITE_NAME__', escape(invitation.brand.name))
        .replaceAll('__IMAGE_TYPE__', escape(invitation.share.imageType))
        .replaceAll('__IMAGE_WIDTH__', String(invitation.share.imageWidth))
        .replaceAll('__IMAGE_HEIGHT__', String(invitation.share.imageHeight))
        .replaceAll('__IMAGE_ALT__', escape(invitation.share.imageAlt))
        .replace('__CANONICAL__', deploymentSiteUrl ? `<link rel="canonical" href="${escape(deploymentSiteUrl)}" /><meta property="og:url" content="${escape(deploymentSiteUrl)}" />` : '')
    },
  }],
})
