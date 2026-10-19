import { test, expect } from '@playwright/test'
import { mkdir, readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { invitation as c } from '../src/config/invitation'

// 本机安全软件会向 HTML 注入其脚本；只隔离已确认的这个外部注入源，项目错误仍严格检查。
test.beforeEach(async ({ page }) => {
  await page.route('http://gc.kis.v2.scr.kaspersky-labs.com/**', (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }))
})

for (const [width, height] of [[375, 667], [390, 844], [430, 844], [390, 667]]) {
  test(`${width}×${height}：七章、无溢出、章节切换和照片查看`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
    await page.setViewportSize({ width, height })
    await mkdir('artifacts/v2', { recursive: true })
    await mkdir('artifacts/v2-review', { recursive: true })
    await page.goto('/')
    await expect(page).toHaveTitle('旧唱片｜1周年庆电子邀请函')
    await expect(page.locator('h1')).toHaveText('旧唱片')
    await expect(page.locator('.cover h2')).toHaveText('1周年 · 感恩有你')
    await expect(page.locator('.cover .tonearm')).toBeVisible()
    await expect(page.locator('.cover .turntable-scene')).toBeVisible()
    await expect(page.locator('.cover .cover-ticket')).toBeVisible()
    await expect(page.locator('.gratitude-poster')).toHaveCount(0)
    await expect(page.locator('.cover')).not.toContainText('邀请')
    await expect(page.getByRole('button', { name: '翻开这一年', exact: true })).toBeVisible()
    await expect(page.locator('.cover-date')).toContainText('10 月 28 日')
    await expect(page.locator('.ticket-date')).toContainText('10 月 28 日')
    await expect(page.locator('.ending-brand')).toContainText('10 月 28 日')
    // 客户确认的地点可含完整名称；页面品牌与分享标题仍为旧唱片。
    await expect(page.locator('.cover h1, .ending-brand h3')).toHaveText(['旧唱片', '旧唱片'])
    await expect(page.locator('.event-ticket dd').nth(1)).toHaveText('旧唱片江景民谣四楼')
    await expect(page.locator('main')).not.toContainText('待定')
    await expect(page.locator('.chapter')).toHaveCount(c.navigation.length)
    for (let index = 0; index < c.navigation.length; index++) {
      await page.getByRole('button', { name: `${index + 1}. ${c.navigation[index]}`, exact: true }).click()
      await expect(page.locator('.chapter-nav .active')).toHaveAttribute('aria-label', `${index + 1}. ${c.navigation[index]}`)
      await page.waitForTimeout(1700)
      expect(await page.locator('.chapters').evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true)
      const chapter = page.locator(`#chapter-${index}`)
      expect(await chapter.evaluate((el) => Array.from(el.querySelectorAll('h1,h2,p,dd,button')).every((node) => {
        const rect = node.getBoundingClientRect(); const parent = el.getBoundingClientRect()
        return rect.right <= parent.right + 2 && rect.left >= parent.left - 2
      }))).toBe(true)
      const names = ['01-cover', '02-story', '03-gallery', '04-event', '05-activities', '06-invitation', '07-ending']
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
  await page.getByRole('button', { name: `6. ${c.navigation[5]}`, exact: true }).click()
  await expect(page.locator('.chapter-nav .active')).toHaveAttribute('aria-label', `6. ${c.navigation[5]}`)
  expect(errors).toEqual([])
})

test('减少动画、单一导航入口、图片资源和分享封面', async ({ page, request }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  expect(await page.locator('.hero-record').evaluate((el) => getComputedStyle(el).animationName)).toBe('none')
  await page.getByRole('button', { name: `6. ${c.navigation[5]}`, exact: true }).click()
  await expect(page.getByRole('link', { name: c.ui.map, exact: false })).toHaveAttribute('href', c.event.navigationUrl)
  await expect(page.locator('.event-actions a')).toHaveCount(1)
  await expect(page.locator('.contact-line')).toHaveCount(0)
  for (const resource of [c.share.image, c.music.src, ...c.gallery.photos.flatMap((p) => [p.src, p.webp, p.avif]), c.brand.logo.src]) expect((await request.get(`/${resource}`)).ok()).toBe(true)
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

test('客户 Logo 保留原比例和白色、正式元数据完整、暂定提示已移除', async ({ page, request }) => {
  await page.goto('/')
  const description = '10月28日 · 旧唱片一周年；诚邀你来赴一场关于音乐、旧唱片与江景的周年之约。'
  const site = 'https://vmc6g8p2tk-lab.github.io/jiuchangpian-anniversary/'
  const image = `${site}share-cover-wechat.jpg`
  const metadata = {
    'meta[name="description"]': description,
    'meta[property="og:title"]': '旧唱片｜1周年庆电子邀请函',
    'meta[property="og:description"]': description,
    'meta[property="og:type"]': 'website',
    'meta[property="og:locale"]': 'zh_CN',
    'meta[property="og:site_name"]': '旧唱片',
    'meta[property="og:image"]': image,
    'meta[property="og:image:secure_url"]': image,
    'meta[property="og:image:type"]': 'image/jpeg',
    'meta[property="og:image:width"]': '1200',
    'meta[property="og:image:height"]': '630',
    'meta[property="og:image:alt"]': '旧唱片｜1周年庆电子邀请函，10月28日，复古黑胶唱片封套',
    'meta[property="og:url"]': site,
    'meta[name="twitter:card"]': 'summary_large_image',
    'meta[name="twitter:title"]': '旧唱片｜1周年庆电子邀请函',
    'meta[name="twitter:description"]': description,
    'meta[name="twitter:image"]': image,
  }
  for (const [selector, content] of Object.entries(metadata)) await expect(page.locator(selector)).toHaveAttribute('content', content)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', site)
  expect(new URL(image).protocol).toBe('https:')
  expect((await request.get('/share-cover-wechat.jpg')).headers()['content-type']).toContain('image/jpeg')
  const logos = await page.locator('.brand-logo img').evaluateAll((images) => images.map((node) => {
    const img = node as HTMLImageElement, box = img.getBoundingClientRect()
    return { ratio: box.width / box.height, naturalRatio: img.naturalWidth / img.naturalHeight, filter: getComputedStyle(img).filter }
  }))
  for (const logo of logos) { expect(logo.ratio).toBeCloseTo(1133 / 230, 1); expect(logo.naturalRatio).toBeCloseTo(1133 / 230, 1); expect(logo.filter).toBe('none') }
  await expect(page.locator('.pending-badge')).toHaveCount(0)
  await expect(page.locator('.celebration')).not.toContainText('活动安排暂定')
  await expect(page.locator('.programme h3')).toHaveText(['周年限定现场', '特邀神秘嘉宾', '老友相聚', '幸运揭晓'])
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0)
  await expect(page.locator('.event-actions a')).toHaveCount(1)
})

test('图片失败显示可读降级，邀请函仍可切屏', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  // 同时覆盖 picture 的 AVIF/WebP 及 JPEG 回退，避免测试仍拦截废弃占位图。
  for (const resource of [c.gallery.photos[0].src, c.gallery.photos[0].webp, c.gallery.photos[0].avif]) {
    await page.route(`**/${resource}`, (route) => route.fulfill({ status: 200, contentType: 'image/jpeg', body: 'invalid image' }))
  }
  await page.goto('/')
  await page.getByRole('button', { name: '3. 旧唱片的夜晚', exact: true }).click()
  await expect(page.locator('.gallery .photo-fallback')).toHaveText('照片暂未加载')
  await page.getByRole('button', { name: '6. 诚挚邀请', exact: true }).click()
  await expect(page.locator('.chapter-nav .active')).toHaveAttribute('aria-label', '6. 诚挚邀请')
  expect(errors).toEqual([])
})

test('精修：邀请正文原样、信息列对齐并容纳长占位文字', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  await page.getByRole('button', { name: '6. 诚挚邀请', exact: true }).click()
  await expect(page.locator('.invitation-copy p').filter({ hasNotText: '期待您的到来。' })).toHaveText([
    '这一晚，', '我们不只庆祝一周年，', '也想和一路同行的朋友，', '再喝一杯，再听一首歌。',
  ])
  await expect(page.locator('.location-heading p')).toHaveText('长沙市岳麓区渔人码头2栋')
  await expect(page.locator('.event-ticket dd')).toHaveText(['21:00', '旧唱片江景民谣四楼', '长沙市岳麓区渔人码头2栋'])
  await expect(page.locator('.formal')).not.toContainText('联系人')
  await expect(page.locator('.formal')).not.toContainText('联系酒吧')
  await expect(page.locator('.event-actions button')).toHaveCount(0)
  const destination = new URL((await page.locator('.event-actions a').getAttribute('href'))!)
  expect(destination.origin + destination.pathname).toBe('https://uri.amap.com/search')
  expect(destination.searchParams.get('keyword')).toBe('长沙市岳麓区渔人码头2栋')
  expect(destination.searchParams.get('city')).toBe('长沙市')
  expect(destination.searchParams.get('view')).toBe('map')
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

test('精修：减少动画时七章正文直接可读、照片说明不互相遮挡', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  for (let index = 0; index < c.navigation.length; index++) {
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

test('周年活动详情：完整原文、七页导航和长页面可滚动阅读', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 667 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('button', { name: '5. 活动详情', exact: true }).click()
  await expect(page.locator('.chapter-nav .active')).toHaveAttribute('aria-label', '5. 活动详情')
  await expect(page.locator('.page-counter')).toHaveText('0507')
  const details = page.locator('.activities')
  await expect(details.locator('h2')).toHaveText('岁月留声 如约新生')
  await expect(details.locator('.activity-eligibility')).toHaveText('10.26-10.28 消费满500元，即可领取抽奖券')
  await expect(details.locator('.activity-draw')).toHaveText('10月28日22:28统一开奖')
  await expect(details.locator('dt')).toHaveText(['特等奖(1名)', '一等奖(2名)', '二等奖(3名)', '参与奖'])
  await expect(details.locator('dd')).toHaveText(['5000元VIP会员卡', '轩尼诗VSOP两支（价值3180元）', '百威大师2支（价值680元）', '凭券领豪华果盘（一客一份）'])
  await expect(details.locator('.activity-benefit')).toHaveText('到店抽取霸王券，券额=当日消费额度，下次消费可用')
  await expect(details.locator('li')).toHaveText(['充5000赠1680', '充10000赠5000', '充20000赠12800'])
  await details.locator('li').last().scrollIntoViewIfNeeded()
  await expect(details.locator('li').last()).toBeInViewport()
  await page.getByRole('button', { name: '6. 诚挚邀请', exact: true }).click()
  await expect(page.locator('.event-ticket dd').first()).toHaveText('21:00')
})

test('客户实景照片：七张全部加载、无占位标签、灯箱逐张查看', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('button', { name: '3. 旧唱片的夜晚', exact: true }).click()
  await expect(page.locator('.archive-item')).toHaveCount(7)
  await expect(page.locator('main .placeholder-label')).toHaveCount(0)
  const images = page.locator('.gallery img')
  for (let i = 0; i < c.gallery.photos.length; i++) {
    await images.nth(i).scrollIntoViewIfNeeded()
    await expect(images.nth(i)).toHaveJSProperty('complete', true)
    expect(await images.nth(i).evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0)
  }
  await page.getByRole('button', { name: c.gallery.photos[0].caption, exact: true }).click()
  for (const photo of c.gallery.photos) {
    await expect(page.getByRole('dialog')).toHaveAttribute('aria-label', photo.caption)
    const img = page.locator('.lightbox img')
    await expect(img).toHaveJSProperty('complete', true)
    expect(await img.evaluate((node: HTMLImageElement) => node.naturalWidth)).toBeGreaterThan(0)
    expect(await img.evaluate(node => getComputedStyle(node).objectFit)).toBe('contain')
    await page.getByRole('button', { name: c.ui.next, exact: true }).click()
  }
  await expect(page.getByRole('dialog')).toHaveAttribute('aria-label', c.gallery.photos[0].caption)
})

test('禁用网页 JavaScript 时，初始 HTML 仍提供分享元数据', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  try {
    const page = await context.newPage()
    await page.goto('/')
    await expect(page).toHaveTitle('旧唱片｜1周年庆电子邀请函')
    await expect(page.locator('.chapter')).toHaveCount(0)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', '10月28日 · 旧唱片一周年；诚邀你来赴一场关于音乐、旧唱片与江景的周年之约。')
    for (const selector of ['meta[property="og:image"]', 'meta[property="og:image:secure_url"]', 'meta[name="twitter:image"]']) {
      await expect(page.locator(selector)).toHaveCount(1)
      await expect(page.locator(selector)).toHaveAttribute('content', 'https://vmc6g8p2tk-lab.github.io/jiuchangpian-anniversary/share-cover-wechat.jpg')
    }
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://vmc6g8p2tk-lab.github.io/jiuchangpian-anniversary/')
  } finally { await context.close() }
})
