import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile, stat, readdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import sharp from 'sharp'
import { invitation as c } from '../src/config/invitation.ts'
import { chromium } from '@playwright/test'

// 严格按真实静态站点挂载 dist，不使用 Vite 开发服务器的资源回退。
const root = path.resolve('dist')
const prefix = process.env.VERIFY_MOUNT_PATH || '/jiuchangpian-anniversary/'
assert.ok(prefix.startsWith('/') && prefix.endsWith('/'), 'VERIFY_MOUNT_PATH 必须以 / 开头和结尾')
const deploymentSiteUrl = process.env.DEPLOY_SITE_URL || c.share.siteUrl
// 参考资料和测试入口不应进入正式发布目录；不能只验证首页可打开。
const emittedFiles = await readdir(root, { recursive: true })
assert.ok(!emittedFiles.some((name) => /client-reference|reference-video|\.mp4$|tests[\\/]fixtures/i.test(name)))
const logoDigest = createHash('sha256').update(await readFile(path.join(root, c.brand.logo.src))).digest('hex')
assert.equal(logoDigest, '639a72e65782fbb6584089b8c2e10a66515901efbbbb656f380bfac150fe2a78', '发布 Logo 必须与客户原图一致')
for (const name of emittedFiles.filter((name) => /\.(html|js|css)$/i.test(name))) {
  const text = await readFile(path.join(root, name), 'utf8')
  assert.ok(!/V1 DEMO|old-record-first-anniversary|client-reference|reference-video|xwechat_files|WXWork/i.test(text), `构建包含旧内容或本地参考路径：${name}`)
}
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.aac': 'audio/aac', '.woff2': 'font/woff2' }
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    if (pathname === prefix.slice(0, -1)) { response.writeHead(301, { Location: prefix }); response.end(); return }
    if (!pathname.startsWith(prefix)) { response.writeHead(404); response.end(); return }
    const filename = path.resolve(root, pathname.slice(prefix.length) || 'index.html')
    if (!filename.startsWith(`${root}${path.sep}`)) { response.writeHead(403); response.end(); return }
    if (!(await stat(filename)).isFile()) throw new Error('Not a file')
    response.writeHead(200, { 'Content-Type': mime[path.extname(filename)] || 'application/octet-stream' })
    response.end(await readFile(filename))
  } catch { response.writeHead(404); response.end() }
})
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const base = `http://127.0.0.1:${server.address().port}`
let browser
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true })
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  await page.route('http://gc.kis.v2.scr.kaspersky-labs.com/**', (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }))
  const problems = []
  const resources = new Set()
  page.on('pageerror', (error) => problems.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') problems.push(message.text()) })
  page.on('response', (response) => {
    if (response.url().startsWith(base)) {
      resources.add(new URL(response.url()).pathname)
      if (response.status() >= 400) problems.push(`HTTP ${response.status()}: ${new URL(response.url()).pathname}`)
    }
  })
  page.on('requestfailed', (request) => problems.push(`Request failed: ${request.url()}`))
  await page.goto(`${base}${prefix.slice(0, -1)}`)
  assert.equal(new URL(page.url()).pathname, prefix)
  if (deploymentSiteUrl) {
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), deploymentSiteUrl)
    assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'), deploymentSiteUrl)
    assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'), new URL(c.share.image, deploymentSiteUrl).href)
  }
  const entryScript = await page.locator('script[type="module"]').getAttribute('src')
  if (process.env.DEPLOY_BASE_PATH && process.env.DEPLOY_BASE_PATH !== './') assert.ok(entryScript.startsWith(process.env.DEPLOY_BASE_PATH))
  assert.equal(await page.title(), '旧唱片｜1周年庆电子邀请函')
  assert.equal(await page.locator('h1').textContent(), '旧唱片')
  for (const selector of ['.cover-date', '.ticket-date', '.ending-brand']) assert.ok((await page.locator(selector).textContent()).includes('10 月 28 日'))
  assert.equal(await page.locator('.ending-brand h3').textContent(), '旧唱片')
  assert.deepEqual(await page.locator('.event-ticket dd').allTextContents(), [c.event.time, c.event.venue, c.event.address])
  assert.equal(await page.locator('.event-actions a').count(), 1)
  assert.equal(await page.locator('.event-actions a').getAttribute('href'), c.event.navigationUrl)
  assert.equal(await page.locator('.contact-line, a[href^="tel:"]').count(), 0)
  assert.ok(!(await page.locator('main').textContent()).includes('待定'))
  const description = '10月28日 · 旧唱片一周年；诚邀你来赴一场关于音乐、旧唱片与江景的周年之约。'
  for (const [selector, expected] of Object.entries({
    'meta[name="description"]': description,
    'meta[property="og:title"]': '旧唱片｜1周年庆电子邀请函',
    'meta[property="og:description"]': description,
    'meta[property="og:site_name"]': '旧唱片',
    'meta[property="og:type"]': 'website',
    'meta[property="og:locale"]': 'zh_CN',
    'meta[property="og:image:secure_url"]': new URL(c.share.image, deploymentSiteUrl).href,
    'meta[property="og:image:type"]': 'image/jpeg',
    'meta[property="og:image:width"]': '1200',
    'meta[property="og:image:height"]': '630',
    'meta[property="og:image:alt"]': c.share.imageAlt,
    'meta[name="twitter:card"]': 'summary_large_image',
    'meta[name="twitter:title"]': '旧唱片｜1周年庆电子邀请函',
    'meta[name="twitter:description"]': description,
    'meta[name="twitter:image"]': new URL(c.share.image, deploymentSiteUrl).href,
  })) assert.equal(await page.locator(selector).getAttribute('content'), expected, selector)
  assert.equal(new URL(await page.locator('meta[property="og:image"]').getAttribute('content')).protocol, 'https:')
  const share = await sharp(path.join(root, c.share.image)).metadata()
  assert.equal(share.width, 1200); assert.equal(share.height, 630)
  assert.equal(await page.locator('.chapter').count(), c.navigation.length)
  await page.getByRole('button', { name: c.ui.open, exact: true }).click()
  // 静态资源验证不要求浏览器允许播放；拒绝播放由功能测试单独验证。
  for (let index = 0; index < c.navigation.length; index++) {
    await page.locator('.chapter-nav button').nth(index).click()
    await page.waitForFunction((i) => document.querySelector('.chapter-nav .active') === document.querySelectorAll('.chapter-nav button')[i], index)
  }
  const imageUrls = await page.locator('img').evaluateAll((images) => images.map((image) => image.src))
  const extraResources = await page.evaluate((image) => [document.querySelector('audio').src, document.querySelector('link[rel="icon"]').href, new URL(image, location.href).href], c.share.image)
  for (const url of new Set([...imageUrls, ...extraResources])) {
    assert.ok(new URL(url).pathname.startsWith(prefix), `Asset escaped subpath: ${url}`)
    assert.equal((await page.request.get(url)).status(), 200, `Missing asset: ${url}`)
  }
  const stylesheet = await page.locator('link[rel="stylesheet"]').getAttribute('href')
  if (process.env.DEPLOY_BASE_PATH && process.env.DEPLOY_BASE_PATH !== './') assert.ok(stylesheet.startsWith(process.env.DEPLOY_BASE_PATH))
  const css = await (await page.request.get(new URL(stylesheet, page.url()).href)).text()
  // 引号内的 SVG data URI 可能包含 url(#filter)，不能把内部片段当作资源请求。
  const urls = [...css.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)]+))\s*\)/g)].map((match) => match[1] ?? match[2] ?? match[3])
  for (const url of urls) {
    if (url.startsWith('data:') || url.startsWith('#')) continue
    const absolute = new URL(url, new URL(stylesheet, page.url())).href
    assert.ok(new URL(absolute).pathname.startsWith(prefix))
    assert.equal((await page.request.get(absolute)).status(), 200, `Missing CSS asset: ${absolute}`)
  }
  assert.ok([...resources].some((url) => url.endsWith('.js')))
  assert.ok([...resources].some((url) => url.endsWith('.css')))
  assert.deepEqual(problems, [])
  console.log(`PASS: base=${process.env.DEPLOY_BASE_PATH || './'}，挂载=${prefix}；JS/CSS/照片/Logo/颗粒/分享图/音频加载；品牌日期及全部 meta 正确；${c.navigation.length}章节正常；无项目 Console 错误。`)
} finally { await browser?.close(); await new Promise((resolve) => server.close(resolve)) }
