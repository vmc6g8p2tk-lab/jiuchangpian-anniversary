import { test, expect } from '@playwright/test'
import { invitation as c } from '../src/config/invitation'

for (const width of [375, 390, 430]) {
  test(`${width}px：六章、无溢出、章节切换和照片查看`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
    await page.setViewportSize({ width, height: width === 375 ? 667 : 844 })
    await page.goto('/')
    await expect(page).toHaveTitle(c.share.title)
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
      await page.screenshot({ path: `artifacts/${width}-chapter-${index + 1}.png` })
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
  for (const resource of [c.share.image, c.music.src, ...c.gallery.photos.map((p) => p.src), c.brand.logo]) expect((await request.get(`/${resource}`)).ok()).toBe(true)
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', c.share.title)
})
