import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from '@playwright/test'

// 严格按真实静态站点挂载 dist，不使用 Vite 开发服务器的资源回退。
const root = path.resolve('dist')
const prefix = '/jiuchangpian-anniversary/'
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.wav': 'audio/wav' }
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
  assert.equal(await page.locator('.chapter').count(), 6)
  await page.getByRole('button', { name: '开启邀请', exact: true }).click()
  await page.waitForFunction(() => !document.querySelector('audio').paused)
  for (let index = 0; index < 6; index++) {
    await page.locator('.chapter-nav button').nth(index).click()
    await page.waitForFunction((i) => document.querySelector('.chapter-nav .active') === document.querySelectorAll('.chapter-nav button')[i], index)
  }
  const imageUrls = await page.locator('img').evaluateAll((images) => images.map((image) => image.src))
  const extraResources = await page.evaluate(() => [document.querySelector('audio').src, new URL('./favicon.svg', location.href).href, new URL('./share-cover.jpg', location.href).href])
  for (const url of new Set([...imageUrls, ...extraResources])) {
    assert.ok(new URL(url).pathname.startsWith(prefix), `Asset escaped subpath: ${url}`)
    assert.equal((await page.request.get(url)).status(), 200, `Missing asset: ${url}`)
  }
  const stylesheet = await page.locator('link[rel="stylesheet"]').getAttribute('href')
  const css = await (await page.request.get(new URL(stylesheet, page.url()).href)).text()
  const urls = [...css.matchAll(/url\((?:["']?)([^)'"\s]+)(?:["']?)\)/g)].map((match) => match[1])
  for (const url of urls) {
    if (url.startsWith('data:')) continue
    const absolute = new URL(url, new URL(stylesheet, page.url())).href
    assert.ok(new URL(absolute).pathname.startsWith(prefix))
    assert.equal((await page.request.get(absolute)).status(), 200)
  }
  assert.ok([...resources].some((url) => url.endsWith('.js')))
  assert.ok([...resources].some((url) => url.endsWith('.css')))
  assert.deepEqual(problems, [])
  console.log('PASS: /jiuchangpian-anniversary/ 子路径；JS/CSS/照片/Logo/颗粒/封面/音频均成功加载；6章节正常；无 Console 错误。')
} finally { await browser?.close(); await new Promise((resolve) => server.close(resolve)) }
