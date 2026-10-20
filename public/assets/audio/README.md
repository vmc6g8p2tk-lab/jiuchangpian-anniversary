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

音乐配置统一在 `src/config/invitation.ts` 的 music 中，含 src、volume、enabled、autoplay、credit。替换曲目必须同时核实授权并更新署名、许可和文件记录；建议更换文件名避免旧缓存。

当前 autoplay=true，使用 preload="metadata"，页面加载后立即调用播放；因此音乐可能在首次进入时开始加载。微信 WeixinJSBridgeReady 事件再补充一次尝试，不引入JS-SDK或需要签名的微信接口。

被浏览器拦截时显示“轻触页面或点击右上角唱片，开启背景音乐”，首次真实触碰页面时再尝试；也可直接点击首页“翻开这一年”或唱片按钮。手动暂停后，自动重试、翻页和首页开启按钮均尊重暂停；点击唱片才主动恢复。单一 audio、loop、跨章续播、失败不阻断浏览继续保留。

关闭 music.autoplay 会恢复 preload="none" 和仅显式点击播放。有声自动播放权限仍由微信/浏览器决定，不能保证所有设备零操作出声。
