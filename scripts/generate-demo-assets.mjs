// 原创数学合成的简单吉他氛围，仅作 Demo；未引用任何第三方录音或歌曲。
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const sharp = require(process.argv[2] || 'sharp')
const root = path.resolve(import.meta.dirname, '..')
const sampleRate = 22050
const duration = 16
const buffer = Buffer.alloc(44 + sampleRate * duration * 2)
buffer.write('RIFF', 0); buffer.writeUInt32LE(buffer.length - 8, 4); buffer.write('WAVEfmt ', 8)
buffer.writeUInt32LE(16, 16); buffer.writeUInt16LE(1, 20); buffer.writeUInt16LE(1, 22)
buffer.writeUInt32LE(sampleRate, 24); buffer.writeUInt32LE(sampleRate * 2, 28)
buffer.writeUInt16LE(2, 32); buffer.writeUInt16LE(16, 34); buffer.write('data', 36); buffer.writeUInt32LE(buffer.length - 44, 40)
const notes = [146.83, 220, 293.66, 369.99, 130.81, 196, 261.63, 329.63, 164.81, 246.94, 329.63, 392, 146.83, 220, 293.66, 440]
for (let i = 0; i < sampleRate * duration; i++) {
  const t = i / sampleRate
  let value = 0
  for (let k = Math.max(0, Math.floor(t) - 4); k <= Math.floor(t); k++) {
    const age = t - k
    const frequency = notes[k]
    const envelope = Math.min(1, age * 100) * Math.exp(-age * 1.6)
    for (let harmonic = 1; harmonic <= 5; harmonic++) value += Math.sin(2 * Math.PI * frequency * harmonic * age) * envelope * 0.14 / harmonic ** 1.8
  }
  const fade = Math.min(1, t / 0.2, (duration - t) / 1.8)
  buffer.writeInt16LE(Math.round(Math.max(-1, Math.min(1, value * fade)) * 32767), 44 + i * 2)
}
fs.writeFileSync(path.join(root, 'public/assets/audio/background.wav'), buffer)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><pattern id="groove" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 3h6" stroke="#36332b"/></pattern></defs><rect width="1200" height="630" fill="#e9dfcb"/><rect x="24" y="24" width="1152" height="582" fill="none" stroke="#b6a17c"/><circle cx="194" cy="359" r="252" fill="#22221d"/><circle cx="194" cy="359" r="245" fill="url(#groove)"/><circle cx="194" cy="359" r="82" fill="#803a32"/><circle cx="194" cy="359" r="8" fill="#e9dfcb"/><text x="504" y="139" font-family="Georgia" font-size="20" letter-spacing="5" fill="#803a32">1st ANNIVERSARY</text><text x="494" y="232" font-family="SimSun,serif" font-size="54" fill="#352b23">旧唱片江景民谣</text><text x="500" y="295" font-family="SimSun,serif" font-size="32" letter-spacing="12" fill="#352b23">一周年庆典</text><text x="490" y="498" font-family="Georgia" font-size="230" fill="#803a32">1</text><text x="648" y="414" font-family="SimSun,serif" font-size="22" fill="#6d5a40">唱针转过一圈，</text><text x="648" y="459" font-family="SimSun,serif" font-size="22" fill="#6d5a40">我们一起走过一年。</text><text x="504" y="555" font-family="SimSun,serif" font-size="16" letter-spacing="3" fill="#836b4a">周年庆邀请函 · V1 DEMO</text></svg>`
await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(root, 'public/share-cover.jpg'))
console.log('已生成本地原创 Demo 音频和分享封面。')
