# 背景音乐

当前正式配置：`solo-acoustic-3-jason-shaw.mp3`。

- 曲名：Solo Acoustic #3；作者：Jason Shaw / Audionautix。
- 来源：https://audionautix.com/free-music/acoustic
- 原始音频：https://audionautix.com/Music/SoloAcoustic3.mp3
- 许可：CC BY 4.0，https://creativecommons.org/licenses/by/4.0/
- 作者明确允许署名后商业使用，需作为其他创作的一部分；不能宣称原创或作者为酒吧背书。
- 本项目保留作者 MP3 原始字节，无裁切、变速、改编或转码；只在播放器调低音量并循环播放。
- 结尾提供可见曲名、作者、来源及许可链接；公开说明见同目录 LICENSE.txt，完整交接记录见 docs/MUSIC_LICENSE.md。

旧 `background.wav` 是16秒原创合成 Demo，保留备份但不再被当前配置引用。

音乐配置统一在 `src/config/invitation.ts` 的 music 中，含 src、volume、enabled、credit。替换曲目必须同时核实授权并更新署名、许可和文件记录；建议更换文件名避免旧缓存。

音频 `preload="none"`，用户点击首页“翻开这一年”或唱片按钮后才加载。单一 audio 实例、loop 跨章节持续播放、暂停续播保留位置；播放失败不阻断浏览。
