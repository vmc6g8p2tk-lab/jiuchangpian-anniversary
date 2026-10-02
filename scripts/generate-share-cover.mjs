// 原生 SVG 排版 + 客户原版 PNG 合成；不修改 Logo 的颜色、文字或比例。
import sharp from 'sharp'
import path from 'node:path'
import { invitation as c } from '../src/config/invitation.ts'

const root = path.resolve(import.meta.dirname, '..')
const escape = (value) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<defs><radialGradient id="wood"><stop stop-color="#513626"/><stop offset="1" stop-color="#251c17"/></radialGradient><pattern id="rings" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 2h7" stroke="#454037" stroke-width="1"/></pattern></defs>
<rect width="1200" height="630" fill="url(#wood)"/>
<rect x="25" y="25" width="1150" height="580" fill="none" stroke="#a88a59" opacity=".5"/>
<circle cx="145" cy="340" r="272" fill="#161513"/><g fill="none" stroke="#3b3730" stroke-width="1">${Array.from({length: 41}, (_, i) => `<circle cx="145" cy="340" r="${83 + i * 4}"/>`).join('')}</g><circle cx="145" cy="340" r="73" fill="#79392e"/><circle cx="145" cy="340" r="8" fill="#ddc799"/>
<circle cx="1100" cy="280" r="200" fill="#171613"/><g fill="none" stroke="#3b3730" stroke-width="1" opacity=".5">${Array.from({length: 30}, (_, i) => `<circle cx="1100" cy="280" r="${60 + i * 4}"/>`).join('')}</g>
<rect x="354" y="163" width="492" height="358" fill="#79392e" stroke="#cba777"/>
<path d="M367 177h466v329H367z" fill="none" stroke="#cca976" opacity=".35"/>
<g text-anchor="middle" fill="#f1e2c5" font-family="SimSun,Songti SC,serif">
<text x="600" y="254" font-size="68" letter-spacing="12">${escape(c.brand.name)}</text>
<text x="600" y="335" font-size="51" letter-spacing="8">${escape(c.ending.anniversary)}</text>
<path d="M473 367h254" stroke="#d7b888" opacity=".6"/>
<text x="600" y="430" font-size="39" letter-spacing="4">${escape(c.event.date.replace(/\s/g, ''))}</text>
<text x="600" y="479" font-size="21" letter-spacing="5">${escape(c.cover.ticket)}</text>
</g><text x="600" y="564" text-anchor="middle" font-family="Georgia,serif" font-size="16" letter-spacing="4" fill="#cbb185">${escape(c.cover.english)}</text>
</svg>`
const logo = await sharp(path.join(root, 'public', c.brand.logo.src)).resize({ width: 370 }).png().toBuffer()
const image = await sharp(Buffer.from(svg)).composite([{ input: logo, left: 415, top: 63 }]).jpeg({ quality: 90, mozjpeg: true }).toBuffer()
await sharp(image).toFile(path.join(root, 'public', c.share.image))
// 旧固定地址也提供新图，避免继续暴露旧名称/V1 封面。
await sharp(image).toFile(path.join(root, 'public/share-cover.jpg'))
console.log(`已生成 ${c.share.image}，1200×630；Logo 与关键信息位于中央方形安全区。`)
