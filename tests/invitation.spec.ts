import { test, expect } from '@playwright/test'
import { mkdir, readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { invitation as c } from '../src/config/invitation'

// 本机安全软件会向 HTML 注入其脚本；只隔离已确认的这个外部注入源，项目错误仍严格检查。
test.beforeEach(async ({ page }) => {
  await page.route('http://gc.kis.v2.scr.kaspersky-labs.com/**', (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }))
})

for (const [width, height] of [[375, 667], [390, 844], [430, 844], [390, 667]]) {
  test(`${width}×${height}：六章、无溢出、章节切换和照片查看`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
    await page.setViewportSize({ width, height })
    await mkdir('artifacts/v2', { recursive: true })
    await mkdir('artifacts/v2-review', { recursive: true })
    await page.goto('/')
    await expect(page).toHaveTitle('旧唱片｜1周年庆电子邀请函')
    await expect(page.locator('h1')).toHaveText('旧唱片')
    await expect(page.locator('.cover-date')).toContainText('10 月 28 日')
    await expect(page.locator('.ticket-date')).toContainText('10 月 28 日')
    await expect(page.locator('.ending-brand')).toContainText('10 月 28 日')
    await expect(page.locator('main')).not.toContainText('旧唱片江景民谣')
    await expect(page.locator('main')).not.toContainText('待定')
    await expect(page.locator('.chapter')).toHaveCount(6)
    for (let index = 0; index < 6; index++) {
      await page.getByRole('button', { name: `${index + 1}. ${c.navigation[index]}`, exact: true }).click()
      await expect(page.locator('.chapter-nav .active')).toHaveAttribute('aria-label', `${index + 1}. ${c.navigation[index]}`)
      await page.waitForTimeout(1700)
      expect(await page.locator('.chapters').evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true)
      const chapter = page.locator(`#chapter-${index}`)
      expect(await chapter.evaluate((el) => Array.from(el.querySelectorAll('h1,h2,p,dd,button')).every((node) => {
        const rect = node.getBoundingClientRect(); const parent = el.getBoundingClientRect()
        return rect.right <= parent.right + 2 && rect.left >= parent.left - 2
      }))).toBe(true)
      const names = ['01-cover', '02-story', '03-gallery', '04-event', '05-invitation', '06-ending']
      await page.screenshot({ path: `artifacts/v2/${width}-${height}-${names[index]}.png` })
      await page.screenshot({ path: `artifacts/v2-review/${width}-${height}-${names[index]}.png` })
      if (width === 390 && height === 844) await page.screenshot({ path: `artifacts/v2/${names[index]}.png` })
      if (width === 390 && height === 844) await page.screenshot({ path: `artifacts/v2-review/${names[index]}.png` })
      if (index === 0 && !(width === 390 && height === 667)) await page.screenshot({ path: `artifacts/v2/mobile-${width}.png` })
      if (index === 0) {
        const buttonBox = await page.getByRole('button', { name: c.ui.open, exact: true }).boundingBox()
        expect(buttonBox!.y + buttonBox!.height).toBeLessThanOrEqual(page.viewportSize()!.height)
      }
    }
    await page.getByRole('button', { name: `3. ${c.navigation[2]}`, exact: true }).click()
    await page.getByRole('button', { name: c.gallery.photos[0].caption, exact: true }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('button', { name: c.ui.next, exact: true }).click()
    await expect(page.getByRole('dialog')).toHaveAttribute('aria-label', c.gallery.photos[1].caption)
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)
    expect(errors).toEqual([])
  })
}

test('用户开启音乐，切章不重播，暂停与继续保持播放位置', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('audio')).toHaveJSProperty('paused', true)
  await page.getByRole('button', { name: c.ui.open, exact: true }).click()
  await expect(page.getByRole('button', { name: c.ui.pause, exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.waitForTimeout(600)
  const start = await page.locator('audio').evaluate((audio: HTMLAudioElement) => audio.currentTime)
  await page.getByRole('button', { name: `4. ${c.navigation[3]}`, exact: true }).click()
  expect(await page.locator('audio').evaluate((audio: HTMLAudioElement) => audio.currentTime)).toBeGreaterThanOrEqual(start)
  await page.getByRole('button', { name: c.ui.pause, exact: true }).click()
  await expect(page.locator('audio')).toHaveJSProperty('paused', true)
  await expect(page.locator('.mini-record')).not.toHaveClass(/is-spinning/)
  const paused = await page.locator('audio').evaluate((audio: HTMLAudioElement) => audio.currentTime)
  await page.getByRole('button', { name: c.ui.play, exact: true }).click()
  await expect(page.locator('audio')).toHaveJSProperty('paused', false)
  expect(await page.locator('audio').evaluate((audio: HTMLAudioElement) => audio.currentTime)).toBeGreaterThanOrEqual(paused)
})

test('拒绝音频播放后邀请函继续可用', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.addInitScript(() => { HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('User gesture required', 'NotAllowedError')) })
  await page.goto('/')
  await page.getByRole('button', { name: c.ui.open, exact: true }).click()
  await expect(page.getByRole('status')).toContainText(c.ui.musicFailed)
  await page.getByRole('button', { name: `5. ${c.navigation[4]}`, exact: true }).click()
  await expect(page.locator('.chapter-nav .active')).toHaveAttribute('aria-label', `5. ${c.navigation[4]}`)
  expect(errors).toEqual([])
})

test('减少动画、地图及电话占位、图片资源和分享封面', async ({ page, request }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  expect(await page.locator('.hero-record').evaluate((el) => getComputedStyle(el).animationName)).toBe('none')
  await page.getByRole('button', { name: `5. ${c.navigation[4]}`, exact: true }).click()
  await expect(page.getByRole('button', { name: c.ui.map, exact: true })).toBeDisabled()
  await expect(page.getByRole('button', { name: c.ui.contact, exact: true })).toBeDisabled()
  for (const resource of [c.share.image, c.music.src, ...c.gallery.photos.map((p) => p.src), c.brand.logo.src]) expect((await request.get(`/${resource}`)).ok()).toBe(true)
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', c.share.title)
})


for (const count of [1, 3, 5]) {
  test(`相册 ${count} 张：按钮、键盘循环和焦点返回`, async ({ page }) => {
    await page.goto(`/tests/fixtures/gallery.html?count=${count}`)
    await expect(page.locator('.archive-item')).toHaveCount(count)
    const first = page.getByRole('button', { name: '测试照片 1', exact: true })
    await first.click()
    await expect(page.getByRole('dialog')).toHaveAttribute('aria-label', '测试照片 1')
    if (count === 1) {
      await expect(page.getByRole('button', { name: '下一张照片' })).toBeDisabled()
      await page.keyboard.press('ArrowRight')
      await expect(page.getByRole('dialog')).toHaveAttribute('aria-label', '测试照片 1')
    } else {
      await page.getByRole('button', { name: '上一张照片' }).click()
      await expect(page.getByRole('dialog')).toHaveAttribute('aria-label', `测试照片 ${count}`)
      await page.getByRole('button', { name: '下一张照片' }).click()
      await expect(page.getByRole('dialog')).toHaveAttribute('aria-label', '测试照片 1')
      for (let i = 0; i < count; i++) await page.keyboard.press('ArrowRight')
      await expect(page.getByRole('dialog')).toHaveAttribute('aria-label', '测试照片 1')
    }
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(first).toBeFocused()
  })
}

test('客户 Logo 保留原比例和白色、正式元数据完整、暂定内容明确', async ({ page, request }) => {
  await page.goto('/')
  const description = '10月28日 · 旧唱片一周年；诚邀你来赴一场关于音乐、旧唱片与江景的周年之约'
  const site = 'https://vmc6g8p2tk-lab.github.io/jiuchangpian-anniversary/'
  const image = `${site}share-cover-v2.jpg`
  const metadata = {
    'meta[name="description"]': description,
    'meta[property="og:title"]': '旧唱片｜1周年庆电子邀请函',
    'meta[property="og:description"]': description,
    'meta[property="og:type"]': 'website',
    'meta[property="og:locale"]': 'zh_CN',
    'meta[property="og:site_name"]': '旧唱片',
    'meta[property="og:image"]': image,
    'meta[property="og:image:type"]': 'image/jpeg',
    'meta[property="og:image:width"]': '1200',
    'meta[property="og:image:height"]': '630',
    'meta[property="og:image:alt"]': '旧唱片官方 Logo、黑胶与1周年纪念，10月28日',
    'meta[property="og:url"]': site,
    'meta[name="twitter:card"]': 'summary_large_image',
    'meta[name="twitter:title"]': '旧唱片｜1周年庆电子邀请函',
    'meta[name="twitter:description"]': description,
    'meta[name="twitter:image"]': image,
  }
  for (const [selector, content] of Object.entries(metadata)) await expect(page.locator(selector)).toHaveAttribute('content', content)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', site)
  expect(new URL(image).protocol).toBe('https:')
  expect((await request.get('/share-cover-v2.jpg')).headers()['content-type']).toContain('image/jpeg')
  const logos = await page.locator('.brand-logo img').evaluateAll((images) => images.map((node) => {
    const img = node as HTMLImageElement, box = img.getBoundingClientRect()
    return { ratio: box.width / box.height, naturalRatio: img.naturalWidth / img.naturalHeight, filter: getComputedStyle(img).filter }
  }))
  for (const logo of logos) { expect(logo.ratio).toBeCloseTo(1133 / 230, 1); expect(logo.naturalRatio).toBeCloseTo(1133 / 230, 1); expect(logo.filter).toBe('none') }
  await expect(page.locator('.pending-badge')).toHaveText('活动安排暂定 · 以最终公布为准')
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0)
  await expect(page.locator('.event-actions a')).toHaveCount(0)
})

test('图片失败显示可读降级，邀请函仍可切屏', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.route('**/assets/images/bar-placeholder.svg', (route) => route.fulfill({ status: 200, contentType: 'image/svg+xml', body: 'invalid image' }))
  await page.goto('/')
  await page.getByRole('button', { name: '3. 旧唱片的夜晚', exact: true }).click()
  await expect(page.locator('.gallery .photo-fallback')).toHaveText('照片暂未加载')
  await page.getByRole('button', { name: '5. 诚挚邀请', exact: true }).click()
  await expect(page.locator('.chapter-nav .active')).toHaveAttribute('aria-label', '5. 诚挚邀请')
  expect(errors).toEqual([])
})

test('精修：邀请正文原样、信息列对齐并容纳长占位文字', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  await page.getByRole('button', { name: '5. 诚挚邀请', exact: true }).click()
  await expect(page.locator('.invitation-copy p').filter({ hasNotText: '期待您的到来。' })).toHaveText([
    '这一晚，', '我们不只庆祝一周年，', '也想和一路同行的朋友，', '再喝一杯，再听一首歌。',
  ])
  await expect(page.locator('.location-heading p')).toHaveText('待确认')
  await expect(page.locator('.event-actions button')).toHaveCount(2)
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0)
  // 仅在测试 DOM 中重复待确认文案，验证未来长字段；不改配置或编造真实地址。
  const columns = await page.locator('.event-ticket dl').evaluate((dl) => {
    dl.querySelector('div:last-child dd')!.textContent = '待确认的详细地址信息'.repeat(6)
    return Array.from(dl.querySelectorAll('div')).map((row) => {
      const dt = row.querySelector('dt')!.getBoundingClientRect(), dd = row.querySelector('dd')!.getBoundingClientRect()
      const parent = dl.getBoundingClientRect()
      return { labelX: dt.x, valueX: dd.x, right: dd.right, parentRight: parent.right, width: row.clientWidth, scrollWidth: row.scrollWidth }
    })
  })
  for (const row of columns) {
    expect(row.labelX).toBeCloseTo(columns[0].labelX, 1)
    expect(row.valueX).toBeCloseTo(columns[0].valueX, 1)
    expect(row.right).toBeLessThanOrEqual(row.parentRight)
    expect(row.scrollWidth).toBeLessThanOrEqual(row.width)
  }
})

test('精修：减少动画时六章正文直接可读、照片说明不互相遮挡', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  for (let index = 0; index < 6; index++) {
    await page.locator('.chapter-nav button').nth(index).click()
    const readable = await page.locator(`#chapter-${index}`).evaluate((chapter) =>
      Array.from(chapter.querySelectorAll('h1,h2,.story-copy p,.gallery-copy p,.programme p,.invitation-copy p,.ending-copy p')).every((node) => {
        let current: Element | null = node
        while (current && current !== chapter.parentElement) {
          const style = getComputedStyle(current)
          if (Number(style.opacity) === 0 || style.visibility === 'hidden' || style.display === 'none') return false
          current = current.parentElement
        }
        return true
      }))
    expect(readable).toBe(true)
  }
  const cards = await page.locator('.archive-item .polaroid').evaluateAll((elements) => elements.map((el) => {
    const r = el.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom }
  }))
  for (let i = 0; i < cards.length; i++) for (let j = i + 1; j < cards.length; j++) {
    const a = cards[i], b = cards[j]
    expect(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top).toBe(true)
  }
})

test('精修：客户 Logo 文件哈希保持原始值', async () => {
  const digest = createHash('sha256').update(await readFile('public/assets/images/brand-logo.png')).digest('hex')
  expect(digest).toBe('639a72e65782fbb6584089b8c2e10a66515901efbbbb656f380bfac150fe2a78')
})
