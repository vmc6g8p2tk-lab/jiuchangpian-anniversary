import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
const directory = path.resolve('public/assets/images')
for (const filename of await fs.readdir(directory)) {
  if (!/\.(jpg|jpeg|png)$/i.test(filename)) continue
  const stem = filename.replace(/\.[^.]+$/, '')
  const image = sharp(path.join(directory, filename)).rotate().resize({ width: 1200, withoutEnlargement: true })
  await Promise.all([
    image.clone().webp({ quality: 80 }).toFile(path.join(directory, `${stem}.webp`)),
    image.clone().avif({ quality: 55 }).toFile(path.join(directory, `${stem}.avif`)),
  ])
  console.log(`已优化 ${filename}`)
}
