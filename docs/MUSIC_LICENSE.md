# 背景音乐授权与交接

核验日期：2026年10月20日。

## 当前曲目

- **Solo Acoustic #3**，Jason Shaw / Audionautix。
- 作者分类：Acoustic，Slow，Relaxing / Calming / Bright。
- 选用方向：慢速原声吉他，配合旧唱片、江景、老友重聚与周年感恩主题。
- [作者曲目列表](https://audionautix.com/free-music/acoustic)
- [官方 MP3](https://audionautix.com/Music/SoloAcoustic3.mp3)
- [作者授权说明](https://audionautix.com/creative-commons-music)
- [作者常见问题](https://audionautix.com/faqs.php)
- [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- [完整许可文本](https://creativecommons.org/licenses/by/4.0/legalcode.en)

作者明确允许按署名要求商业使用；本项目将音乐作为周年庆 H5 的组成部分，不单独销售音乐。此为有条件授权使用，不代表曲目没有著作权或保证不存在任何第三方争议。

## 文件与署名

正式路径：public/assets/audio/solo-acoustic-3-jason-shaw.mp3。

原文件5089138字节；浏览器实际解码时长126.64秒，双声道44.1kHz。SHA-256：

```text
ba6f3e1c034dc6816061494071d09ce734c4674a59929e3765d83d7a849b5cbd
```

直接保留作者下载文件，无裁切、变速、转码或旋律改编。播放器音量为0.24，循环播放。原16秒 background.wav Demo保留，不再引用。

页面结尾常驻可见署名：“背景音乐：Solo Acoustic #3 · Jason Shaw / Audionautix”，并提供曲目来源及 CC BY 4.0 链接。播放器标题同步显示曲名和作者。发布目录附带 assets/audio/LICENSE.txt。

署名不暗示作者或平台支持、赞助或认可本酒吧。后续换曲时同步更新 music.credit、许可记录与素材文件，不保留旧作者署名。

## 证据留档

本地 artifacts/music-license-evidence/ 保存作者曲目页、授权页、FAQ、CC许可页的HTML快照与 manifest.json；记录抓取时间、URL、HTTP状态及哈希。该目录按既有策略被Git忽略，不进入dist。随源码交付本文件及公开 LICENSE.txt 即可追溯来源；保管方也可另行归档本地证据。

## 播放与发布

音频从本项目自身路径加载，沿用 import.meta.env.BASE_URL，兼容普通相对路径及 GitHub Pages /jiuchangpian-anniversary/。网页不依赖作者音频站实时可用。

当前 music.autoplay=true，preload="metadata"，页面挂载后立即尝试播放。微信宿主 WeixinJSBridgeReady 事件就绪后补充一次尝试；只监听事件，不加载JS-SDK、不调用微信签名接口。若浏览器拒绝有声自动播放，首次触碰页面再尝试，并保留显式音乐按钮和首页开启入口。手动暂停会阻止自动重试和翻页抢播。保留单一audio、跨章节续播、失败提示与继续浏览。

浏览器有声自动播放政策仍适用，不能承诺全部微信/iOS设备零操作出声；需真机检查。参考 [Chrome自动播放策略](https://developer.chrome.com/blog/autoplay)。测试浏览器允许自动播放的参数仅用于验证允许分支，不改用户浏览器设置，也不能作为微信真机成功证据。

本次接入没有修改活动内容、客户Logo、照片、分享标题或部署工作流。是否已经发布以实际部署结果为准，本地配置修改和构建不等于线上更新。

## 音乐首次接入验收（56e66b4，自动播放调整前的历史记录）

- npm run lint、npm run typecheck：通过。
- Playwright全量19项：通过，含实际MP3解码、单实例、切章续播、暂停继续、播放拒绝降级、署名链接，以及375/390/430px和390×667布局回归。
- 普通build及两个挂载路径（/jiuchangpian-anniversary/、/relative-path-check/）验证：通过。
- GitHub Pages目标build、分享元信息检查、子路径资源检查：通过。
- 音轨信号检查：非静音，RMS约0.146；用户操作前无MP3请求，实际播放成功，无页面错误。
- 390×844结尾署名完整可见；截图 artifacts/music-review/390-ending-credit.png，机器结果 artifacts/music-review/verification.json。
- git diff --check：通过；客户Logo SHA-256与原图一致。

以上记录为发布前本地验收，验收时尚未commit、push或部署。2026年10月20日客户已确认发布；线上状态以对应Git提交、GitHub Pages工作流及公网复核结果为准。预览服务：http://localhost:5174/ 。

## 进入即尝试播放调整验收（2026年10月20日）

- lint、typecheck及Playwright全量22项通过。
- 在独立Chrome测试进程中明确允许自动播放：未经点击实际播放成功，随后手动暂停，微信就绪事件及首页开启按钮不抢播。
- 在独立Chrome测试进程中明确要求用户激活：自动播放被实际浏览器策略拒绝，显示提示，首次真实点击页面后播放成功。
- 模拟WeixinJSBridgeReady事件：追加一次尝试；模拟持续拒绝播放：仍可翻页和浏览。
- 普通/GitHub Pages目标构建、分享元数据、相对路径及GitHub子路径检查全部通过。
- MP3及客户Logo文件哈希保持原样；git diff --check通过。

以上浏览器分支测试不是微信/iPhone/Android真机证据。正式设备仍可能要求首次触碰才能出声；没有绕过浏览器策略或假造微信SDK权限。
