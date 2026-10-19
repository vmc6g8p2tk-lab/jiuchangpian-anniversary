// 生成正式 JPEG 与裁切验收图；CSS/几何图形均为原创，客户 Logo 原文件不改动。
import { chromium } from '@playwright/test'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { invitation as c } from '../src/config/invitation.ts'

const root = path.resolve(import.meta.dirname, '..')
const review = path.join(root, 'artifacts/wechat-share-review')
await mkdir(review, { recursive: true })
const fileUrl = (file) => pathToFileURL(path.join(root, file)).href
const escape = (text) => text.replace(/[&<>"']/g, (v) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[v])
const logoPath = path.join(root, 'public', c.brand.logo.src)
const logoBefore = createHash('sha256').update(await readFile(logoPath)).digest('hex')
const output = path.join(root, 'public', c.share.image)
const html = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>旧唱片正式分享封面</title><style>
*{box-sizing:border-box}html,body{margin:0;width:1200px;height:630px}body{font-family:'Songti SC','STSong','SimSun',serif}.cover{width:1200px;height:630px;overflow:hidden;position:relative;background:radial-gradient(ellipse at 50% 35%,#59402b,#211a16 75%);color:#f1e2c5}.cover:after{content:'';position:absolute;inset:23px;border:1px solid #b18e5880;pointer-events:none}.disc{position:absolute;width:540px;aspect-ratio:1;border-radius:50%;left:-120px;top:140px;background:repeating-radial-gradient(circle,#181715 0 1px,#38342d 1.5px,#121211 3px,#28251f 4px);box-shadow:inset 0 0 0 2px #655943,0 9px 25px #0007}.disc:before{content:'';position:absolute;inset:35%;border-radius:50%;background:#6d3028;border:2px solid #b28c5666}.disc:after{content:'';position:absolute;inset:49%;border-radius:50%;background:#d1b079}.disc.right{width:400px;left:auto;right:-110px;top:85px;opacity:.85}.logo{position:absolute;left:415px;top:44px;width:370px;line-height:0;z-index:2}.logo img{width:100%;height:auto;display:block;filter:none}.sleeve{position:absolute;left:340px;top:165px;width:520px;height:355px;background:linear-gradient(110deg,#823c30,#6b2e28);border:1px solid #b99765;text-align:center;padding:32px 18px;z-index:2;box-shadow:0 8px 20px #0002}.sleeve:after{content:'';position:absolute;inset:10px;border:1px solid #bb99664d;pointer-events:none}h1{font-size:84px;line-height:1.2;letter-spacing:12px;font-weight:500;margin:0 0 21px}h2{font-size:38px;line-height:1.5;letter-spacing:3px;font-weight:400;margin:0}.rule{width:220px;height:1px;background:#c6a56d80;margin:22px auto}.date{font-size:44px;letter-spacing:5px;line-height:1.3;margin:0}.english{position:absolute;left:380px;right:380px;top:554px;text-align:center;font:15px/1.5 Georgia,serif;letter-spacing:3px;color:#c4a574}
</style><article class="cover"><div class="disc"></div><div class="disc right"></div><div class="logo"><img src="${fileUrl('public/' + c.brand.logo.src)}" alt="${escape(c.brand.logo.alt)}"></div><div class="sleeve"><h1>${escape(c.brand.name)}</h1><h2>${escape(c.share.coverSubtitle)}</h2><div class="rule"></div><p class="date">${escape(c.event.date.replace(/\s/g, ''))}</p></div><p class="english">${escape(c.cover.english)}</p></article></html>`
await writeFile(path.join(review, 'cover-source.html'), html)
const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  await page.goto(pathToFileURL(path.join(review, 'cover-source.html')).href)
  await page.locator('.logo img').evaluate((img) => img.decode())
  const boxes = await page.locator('.logo,h1,h2,.date').evaluateAll((nodes) => nodes.map((node) => { const r = node.getBoundingClientRect(); return { text: node.textContent, left: r.left, right: r.right, top: r.top, bottom: r.bottom } }))
  if (!boxes.every((r) => r.left >= 285 && r.right <= 915 && r.top >= 0 && r.bottom <= 630)) throw new Error('核心信息超出中央630×630安全区域')
  await page.screenshot({ path: output, type: 'jpeg', quality: 94 })
  const preview = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><style>body{background:#24201b;color:#e8d7b8;font:16px Arial;padding:26px;margin:0}h1{font-size:22px;margin:0 0 20px}.row{display:flex;align-items:flex-start;gap:24px}figure{margin:0}figcaption{margin:12px 0 22px}img{display:block;object-fit:cover}.wide{width:600px;height:315px}.square{width:315px;height:315px}.thumb{width:160px;height:160px}.tiny{width:96px;height:96px}.crop{width:630px;height:630px}</style><h1>分享封面 · 原图 / 中央方形 / 小缩略图验收</h1><div class="row"><figure><img class="wide" src="${pathToFileURL(output).href}"><figcaption>1200×630（缩小预览）</figcaption></figure><figure><img class="square" src="${pathToFileURL(output).href}"><figcaption>中央630×630裁切</figcaption></figure><figure><img class="thumb" src="${pathToFileURL(output).href}"><figcaption>160×160</figcaption><img class="tiny" src="${pathToFileURL(output).href}"><figcaption>96×96</figcaption></figure></div>`
  await writeFile(path.join(review, 'preview.html'), preview)
  await page.setViewportSize({ width: 1250, height: 450 })
  await page.goto(pathToFileURL(path.join(review, 'preview.html')).href)
  await page.evaluate(() => Promise.all(Array.from(document.images).map((img) => img.decode())))
  await page.screenshot({ path: path.join(review, 'cover-review.png'), fullPage: true })
  for (const [selector, name] of [['.square', 'cover-square-315.png'], ['.thumb', 'cover-square-160.png'], ['.tiny', 'cover-square-96.png']]) await page.locator(selector).screenshot({ path: path.join(review, name) })
  await writeFile(path.join(review, 'safe-area.json'), JSON.stringify({ size: [1200, 630], centerSquare: { x: 285, y: 0, width: 630, height: 630 }, boxes }, null, 2))
} finally { await browser.close() }
const logoAfter = createHash('sha256').update(await readFile(logoPath)).digest('hex')
if (logoAfter !== logoBefore) throw new Error('客户 Logo 原文件发生变化')
console.log(`已生成 public/${c.share.image}（1200×630 JPEG），旧封面文件保持原样；方形及缩略图预览位于 artifacts/wechat-share-review。`)
