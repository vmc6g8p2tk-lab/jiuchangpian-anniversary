/** 所有客户可替换内容集中在这里。public 素材路径不带 public 前缀。 */
export const invitation = {
  brand: { name: '旧唱片江景民谣', shortName: '旧唱片', english: 'OLD RECORD · RIVERSIDE FOLK', headerEnglish: 'RIVERSIDE FOLK', logo: 'assets/images/logo-placeholder.svg', logoAlt: '旧唱片 Demo 唱片标志' },
  edition: 'VOL. 01',
  navigation: ['序曲', '这一年', '旧唱片的夜晚', '特别之夜', '诚挚邀请', '下一面唱片'],
  navigationLabel: '邀请函章节',
  pendingValue: '待定',
  ui: { open: '开启邀请', swipe: '向上滑动，继续听故事', play: '播放背景音乐', pause: '暂停背景音乐', loadingMusic: '音乐开启中', musicFailed: '音乐暂未开启，您可以继续浏览或再次点击唱片。', close: '关闭照片', previous: '上一张照片', next: '下一张照片', back: '再听一遍故事', demo: 'V1 · 风格预览', photoHint: '轻触照片，收藏这一刻', imageFailed: '照片暂未加载', navigationPending: '详细地址确认后开启导航', contactPending: '联系人及电话待确认', map: '查看地图 · 导航', contact: '联系酒吧', portraitHint: '竖屏浏览，更像一封唱片里的信' },
  cover: { kicker: '一封来自江边的邀请', english: '1st ANNIVERSARY', title: '一周年庆典', number: '1', numberSuffix: 'st', subtitle: '唱针转过一圈，\n我们一起走过一年', label: '江边的歌，唱了一年。', side: 'SIDE A · THE FIRST YEAR', ticket: '周年庆邀请函', ticketEnglish: 'A NIGHT TO REMEMBER', footer: '致 · 一路同行的你' },
  story: { kicker: 'SIDE A / 01', title: '这一年，\n我们把故事唱进夜里', lines: ['365个夜晚，', '一把吉他，一杯酒，', '还有每一个来到旧唱片的人。', '', '从第一首歌，', '到今天的一周年。', '', '感谢每一次相遇。'], stamp: '365 NIGHTS', note: '每一首歌里，都有你的故事。', photoCaption: '记忆里的第一场演出', photo: 'assets/images/live-placeholder.svg', photoAlt: '暖光舞台与吉他的原创占位插画', placeholder: '演出照片 · 待替换' },
  gallery: { kicker: 'SIDE A / 02', title: '旧唱片的夜晚', copy: ['音乐、江景、朋友和酒。', '有些夜晚，值得被唱很久。'], photos: [
    { src: 'assets/images/bar-placeholder.svg', alt: '木质酒吧和暖色灯光原创占位插画', caption: '01 / 把夜晚留给音乐', placeholder: '酒吧环境 · 待替换', webp: '', avif: '' },
    { src: 'assets/images/river-placeholder.svg', alt: '江景与月色原创占位插画', caption: '02 / 江风刚好，你也在', placeholder: '江景照片 · 待替换', webp: '', avif: '' },
    { src: 'assets/images/live-placeholder.svg', alt: '吉他与舞台原创占位插画', caption: '03 / 故事，在歌声里继续', placeholder: '驻唱演出 · 待替换', webp: '', avif: '' },
  ] },
  celebration: { kicker: 'SIDE B / 01', title: '一周年 · 特别之夜', english: 'FOR OUR OLD FRIENDS', intro: '把熟悉的旋律，唱给最熟悉的你。', seal: '周 年 限 定', items: [
    { number: '01', title: '周年限定现场', subtitle: '这一晚，为你而唱', icon: 'record' },
    { number: '02', title: '民谣 Live', subtitle: '一把吉他，把心事唱成歌', icon: 'guitar' },
    { number: '03', title: '周年限定酒饮', subtitle: '为相遇，举一杯', icon: 'glass' },
    { number: '04', title: '老友重聚', subtitle: '好久不见，还是老位置', icon: 'friends' },
    { number: '05', title: '特别惊喜', subtitle: '把期待留到那一晚', icon: 'star' },
  ], footer: 'ONE YEAR OF MUSIC, MANY MORE TO COME.' },
  event: { kicker: 'YOU ARE INVITED', title: '诚挚邀请您', subtitle: '共赴旧唱片一周年之约', fields: { date: '日期', time: '时间', venue: '地点', address: '地址' }, date: '待定', time: '待定', venue: '待定', address: '待定', contact: '', phone: '', navigationUrl: '', copy: ['这一晚，', '我们不只庆祝一周年，', '也想和一路同行的朋友，', '再喝一杯，再听一首歌。'], closing: '期待您的到来。', ticketTitle: '老友入场券', ticketNumber: 'NO. 0001', addressLabel: '相聚的地方', contactLabel: '联系人 / 电话' },
  ending: { kicker: 'SIDE B / THE NEXT RECORD', anniversary: '一周年', title: '故事未完，', lines: ['下一面唱片，', '继续与你一起播放。'], english: 'THANK YOU FOR BEING WITH US.', dateLabel: '周年日期', signoff: '留一个位置，给老朋友。' },
  music: { src: 'assets/audio/background.wav', label: '原创合成吉他氛围 · Demo', enabled: true, volume: 0.3 },
  share: { title: '旧唱片江景民谣 · 1周年庆电子邀请函', description: '唱针转过一圈，我们一起走过一年。诚挚邀请您，共赴旧唱片一周年之约。', image: 'share-cover.jpg', siteUrl: 'https://old-record-first-anniversary.ivory-ring-6744.chatgpt.site/' },
} as const
