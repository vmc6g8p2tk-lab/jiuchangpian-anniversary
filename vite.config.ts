import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { invitation } from './src/config/invitation'

const escape = (text: string) => text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
export default defineConfig({
  // 相对资源路径同时适用于域名根目录和 /jiuchangpian-anniversary/。
  // public 图片/音频也通过 import.meta.env.BASE_URL 读取，避免指向站点根目录。
  base: './',
  plugins: [react(), {
    name: 'invitation-metadata',
    transformIndexHtml(html) {
      return html.replaceAll('__TITLE__', escape(invitation.share.title))
        .replaceAll('__DESCRIPTION__', escape(invitation.share.description))
        .replaceAll('__SHARE_IMAGE__', escape(invitation.share.siteUrl ? new URL(invitation.share.image, invitation.share.siteUrl).href : invitation.share.image))
        .replace('__CANONICAL__', invitation.share.siteUrl ? `<link rel="canonical" href="${escape(invitation.share.siteUrl)}" /><meta property="og:url" content="${escape(invitation.share.siteUrl)}" />` : '')
    },
  }],
})
