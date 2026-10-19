import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { invitation as c } from '../src/config/invitation.ts'

// 直接读取构建文件，不执行任何网页 JavaScript，检查抓取器收到的初始 HTML。
const html = await readFile('dist/index.html', 'utf8')
const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head\s*>/i)?.[1]
assert.ok(head, '缺少 head')
assert.ok(!/__\w+__/.test(head), '分享模板占位符未替换')
const decode = (s) => s.replace(/&(amp|lt|gt|quot|#39);/g, (_, name) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" })[name])
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map((m) => [m[1].toLowerCase(), decode(m[2] ?? m[3])]))
const tags = (source, name) => [...source.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((m) => attributes(m[0]))
const site = process.env.DEPLOY_SITE_URL || c.share.siteUrl
const image = new URL(c.share.image, site).href
assert.equal(c.share.title, '旧唱片｜1周年庆电子邀请函')
assert.equal(c.share.description, '10月28日 · 旧唱片一周年；诚邀你来赴一场关于音乐、旧唱片与江景的周年之约。')
assert.equal(new URL(site).protocol, 'https:')
assert.equal(new URL(image).protocol, 'https:')
assert.ok(new URL(image).pathname.startsWith(new URL(site).pathname))
const titles = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)]
assert.equal(titles.length, 1, 'title 必须唯一')
assert.equal(decode(titles[0][1]), c.share.title)
assert.ok(head.includes(titles[0][0]), 'title 必须在初始 head 中')
const expected = {
  description: c.share.description,
  'og:title': c.share.title,
  'og:description': c.share.description,
  'og:type': 'website',
  'og:url': site,
  'og:image': image,
  'og:image:secure_url': image,
  'og:image:type': 'image/jpeg',
  'og:image:width': '1200',
  'og:image:height': '630',
  'og:image:alt': c.share.imageAlt,
  'og:site_name': c.brand.name,
  'twitter:card': 'summary_large_image',
  'twitter:title': c.share.title,
  'twitter:description': c.share.description,
  'twitter:image': image,
}
for (const [key, value] of Object.entries(expected)) {
  const attr = key.startsWith('og:') ? 'property' : 'name'
  const matches = tags(html, 'meta').filter((tag) => tag[attr] === key)
  assert.equal(matches.length, 1, `${key} 存在重复或缺失`)
  assert.equal(tags(head, 'meta').filter((tag) => tag[attr] === key).length, 1, `${key} 不在初始 head 中`)
  assert.equal(matches[0].content, value, `${key} 内容错误`)
}
const canonical = tags(html, 'link').filter((tag) => tag.rel === 'canonical')
assert.equal(canonical.length, 1, 'canonical 必须唯一')
assert.equal(canonical[0].href, site)
assert.equal(tags(head, 'link').filter((tag) => tag.rel === 'canonical').length, 1)
const favicon = tags(head, 'link').filter((tag) => tag.rel === 'icon')
assert.equal(favicon.length, 1)
assert.ok(favicon[0].href.endsWith('/favicon.svg') || favicon[0].href === './favicon.svg')
assert.ok((await stat('dist/favicon.svg')).size > 0)
const cover = path.join('dist', c.share.image)
const meta = await sharp(cover).metadata()
assert.equal(meta.format, 'jpeg')
assert.equal(meta.width, 1200)
assert.equal(meta.height, 630)
assert.ok((await readFile(cover)).equals(await readFile(path.join('public', c.share.image))), '构建分享图与正式图片不一致')
if (process.env.DEPLOY_BASE_PATH && process.env.DEPLOY_BASE_PATH !== './') {
  assert.ok(html.includes(`src="${process.env.DEPLOY_BASE_PATH}assets/`), '构建入口基础路径错误')
}
console.log(JSON.stringify({ result: 'PASS', initialHtml: true, uniqueMetaCount: Object.keys(expected).length, site, image, cover: { format: meta.format, width: meta.width, height: meta.height, bytes: (await stat(cover)).size }, favicon: favicon[0].href }, null, 2))
