/** 所有客户可替换内容集中在这里。public 素材路径不带 public 前缀。 */
const eventAddress = '长沙市岳麓区渔人码头2栋'
// 按客户地址打开高德地图搜索；不猜测经纬度或 POI。
const navigationUrl = `https://uri.amap.com/search?keyword=${encodeURIComponent(eventAddress)}&city=${encodeURIComponent('长沙市')}&view=map`

export const invitation = {
  brand: { name: '旧唱片', shortName: '旧唱片', english: 'OLD RECORD', logo: { src: 'assets/images/brand-logo.png', alt: '旧唱片官方 Logo（客户原版组合标志）', width: 1133, height: 230 } },
  edition: 'VOL. 01',
  navigation: ['序曲', '这一年', '旧唱片的夜晚', '特别之夜', '活动详情', '诚挚邀请', '下一面唱片'],
  navigationLabel: '周年纪念章节',
  pendingValue: '待确认',
  ui: { open: '翻开这一年', swipe: '向上滑动，继续听故事', play: '播放背景音乐', pause: '暂停背景音乐', loadingMusic: '音乐开启中', musicFailed: '音乐暂未开启，您可以继续浏览或再次点击唱片。', close: '关闭照片', previous: '上一张照片', next: '下一张照片', back: '再听一遍故事', demo: 'V2 · 风格预览', photoHint: '轻触照片，放大查看', imageFailed: '照片暂未加载', navigationPending: '详细地址确认后开启导航', map: '查看地图 · 导航', portraitHint: '竖屏浏览，更像一封唱片里的信' },
  cover: { kicker: '一周年 · 留声纪念', english: '1st ANNIVERSARY', title: '1周年庆典', number: '1', numberSuffix: 'st', subtitle: '唱针转过一圈，\n我们一起走过一年', label: '江边的歌，唱了一年。', side: 'SIDE A · THE FIRST YEAR', gratitude: '1周年 · 感恩有你', ticket: '感谢一路同行', ticketEnglish: 'THANK YOU FOR BEING WITH US', footer: '致 · 一路同行的你' },
  story: { kicker: 'SIDE A / 01', title: '这一年，\n我们把故事唱进夜里', lines: ['365个夜晚，', '一把吉他，一杯酒，', '还有每一个来到旧唱片的人。', '', '从第一首歌，', '到今天的一周年。', '', '感谢每一次相遇。'], stamp: '365 NIGHTS', note: '每一首歌里，都有你的故事。', photoCaption: '记忆里的现场演出', photo: 'assets/images/photos/live-stage.jpg', photoWebp: 'assets/images/photos/live-stage.webp', photoAvif: 'assets/images/photos/live-stage.avif', photoAlt: '旧唱片舞台上乐队与歌手的演出现场', placeholder: '' },
  gallery: { kicker: 'SIDE A / 02', title: '旧唱片的夜晚', copy: ['音乐、江景、朋友和酒。', '有些夜晚，值得被唱很久。'], photos: [
    { src: 'assets/images/photos/bar-interior.jpg', alt: '旧唱片木质桌椅、暖灯和复古海报环绕的舞台', caption: '01 / 把夜晚留给音乐', placeholder: '', webp: 'assets/images/photos/bar-interior.webp', avif: 'assets/images/photos/bar-interior.avif' },
    { src: 'assets/images/photos/river-night.jpg', alt: '长沙江畔夜景，桥梁灯光与江面倒影', caption: '02 / 江风刚好，你也在', placeholder: '', webp: 'assets/images/photos/river-night.webp', avif: 'assets/images/photos/river-night.avif' },
    { src: 'assets/images/photos/live-stage.jpg', alt: '旧唱片乐队与歌手的舞台合唱现场', caption: '03 / 故事，在歌声里继续', placeholder: '', webp: 'assets/images/photos/live-stage.webp', avif: 'assets/images/photos/live-stage.avif' },
    { src: 'assets/images/photos/friends-night.jpg', alt: '旧唱片观众席中挥舞荧光棒的相聚夜晚', caption: '04 / 把掌声留在这一晚', placeholder: '', webp: 'assets/images/photos/friends-night.webp', avif: 'assets/images/photos/friends-night.avif' },
    { src: 'assets/images/photos/live-room.jpg', alt: '从观众席望向旧唱片舞台的演出全景', caption: '05 / 灯光亮起，音乐响起', placeholder: '', webp: 'assets/images/photos/live-room.webp', avif: 'assets/images/photos/live-room.avif' },
    { src: 'assets/images/photos/live-closeup.jpg', alt: '旧唱片歌手与乐手的现场演出近景', caption: '06 / 熟悉的歌，一起唱', placeholder: '', webp: 'assets/images/photos/live-closeup.webp', avif: 'assets/images/photos/live-closeup.avif' },
    { src: 'assets/images/photos/live-ensemble.jpg', alt: '旧唱片舞台上身着演出服饰的合唱表演', caption: '07 / 相聚的夜晚，留在歌里', placeholder: '', webp: 'assets/images/photos/live-ensemble.webp', avif: 'assets/images/photos/live-ensemble.avif' },
  ] },
  celebration: { pending: false, pendingLabel: '活动安排暂定 · 以最终公布为准', kicker: 'SIDE B / 01', title: '一周年 · 特别之夜', english: 'FOR OUR OLD FRIENDS', intro: '把熟悉的旋律，唱给最熟悉的你。', seal: '周 年 限 定', items: [
    { number: '01', title: '周年限定现场', subtitle: '这一晚，为你而唱', icon: 'record' },
    { number: '02', title: '特邀神秘嘉宾', subtitle: '把惊喜，留给相聚的你', icon: 'guitar' },
    { number: '03', title: '老友相聚', subtitle: '好久不见，还是老位置', icon: 'friends' },
    { number: '04', title: '幸运揭晓', subtitle: '22:28，揭晓幸运时刻', icon: 'star' },
  ], footer: 'ONE YEAR OF MUSIC, MANY MORE TO COME.' },
  activities: {
    title: '旧唱片周年庆', slogan: '岁月留声 如约新生', heading: '【旧唱片】周年庆活动详情',
    lottery: { title: '幸运大抽奖', eligibility: '10.26-10.28 消费满500元，即可领取抽奖券', draw: '10月28日22:28统一开奖', prizes: [
      { label: '特等奖(1名)', reward: '5000元VIP会员卡' },
      { label: '一等奖(2名)', reward: '轩尼诗VSOP两支（价值3180元）' },
      { label: '二等奖(3名)', reward: '百威大师2支（价值680元）' },
      { label: '参与奖', reward: '凭券领豪华果盘（一客一份）' },
    ] },
    benefit: { title: '10月28日专属福利', copy: '到店抽取霸王券，券额=当日消费额度，下次消费可用' },
    recharge: { title: '周年充值礼遇', offers: ['充5000赠1680', '充10000赠5000', '充20000赠12800'] },
  },
  event: { kicker: 'YOU ARE INVITED', title: '诚挚邀请您', subtitle: '共赴旧唱片一周年之约', fields: { date: '日期', time: '时间', venue: '地点', address: '地址' }, date: '10 月 28 日', time: '21:00', venue: '旧唱片江景民谣四楼', address: eventAddress, navigationUrl, copy: ['这一晚，', '我们不只庆祝一周年，', '也想和一路同行的朋友，', '再喝一杯，再听一首歌。'], closing: '期待您的到来。', ticketTitle: '老友入场券', ticketNumber: 'NO. 0001', addressLabel: '相聚的地方' },
  ending: { kicker: 'SIDE B / THE NEXT RECORD', anniversary: '1周年', title: '故事未完，', lines: ['下一面唱片，', '继续与你一起播放。'], english: 'THANK YOU FOR BEING WITH US.', dateLabel: '周年日期', signoff: '留一个位置，给老朋友。' },
  music: { src: 'assets/audio/background.wav', label: '原创合成吉他氛围 · Demo', enabled: true, volume: 0.3 },
  share: { title: '旧唱片｜1周年·感恩有你', description: '10月28日21:00 · 旧唱片一周年；感谢一路同行，让音乐与故事继续与你相伴。', image: 'share-cover-v2.jpg', imageAlt: '旧唱片官方 Logo、黑胶与1周年纪念，10月28日', imageWidth: 1200, imageHeight: 630, imageType: 'image/jpeg', siteUrl: 'https://vmc6g8p2tk-lab.github.io/jiuchangpian-anniversary/' },
} as const
