import sharp from 'sharp'
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'

// 原片仅在本地留存；压缩、缩放并去除拍摄元数据，不调色、不生成新画面。
const sourceRoot = path.resolve(process.argv[2] || 'client-reference/photos')
const outputRoot = path.resolve('public/assets/images/photos')
const photos = [
  ['bar-interior', 'ebde230c-84f0-459c-bf5c-2cf240d3ad88.jpg'],
  ['river-night', 'ccfcb4b6-e06a-4828-9493-830a7c8a5960.jpg'],
  ['live-stage', '81dd8f30-46d4-4fb7-b444-e02d51c95d46.jpg'],
  ['friends-night', '50ca18d4-d7ba-4175-8752-e30aa4fbbc3a.jpg'],
  ['live-room', '468f503b-522f-4021-8cfd-4d9d0dc57a40.jpg'],
  ['live-closeup', '6affeeaf-a284-4c90-8281-b59e0fc88663.jpg'],
  ['live-ensemble', 'e2576279-0f8f-4548-b53e-2cc49543c925.jpg'],
]
await mkdir(outputRoot, { recursive: true })
const report = []
for (const [name, filename] of photos) {
  const input = await readFile(path.join(sourceRoot, filename))
  const original = await sharp(input).metadata()
  const image = sharp(input).rotate().resize({ width: 1200, withoutEnlargement: true })
  await image.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(outputRoot, `${name}.jpg`))
  await image.clone().webp({ quality: 80 }).toFile(path.join(outputRoot, `${name}.webp`))
  await image.clone().avif({ quality: 52, effort: 4 }).toFile(path.join(outputRoot, `${name}.avif`))
  const sizes = {}
  for (const ext of ['jpg', 'webp', 'avif']) sizes[ext] = (await stat(path.join(outputRoot, `${name}.${ext}`))).size
  report.push({ name, filename, sha256: createHash('sha256').update(input).digest('hex'), width: original.width, height: original.height, originalBytes: input.length, sizes })
}
await writeFile(path.join(sourceRoot, 'photos-manifest.json'), JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify(report, null, 2))
