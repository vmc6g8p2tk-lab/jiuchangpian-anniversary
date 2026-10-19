import { invitation as c } from '../config/invitation'
import { Reveal } from './Reveal'

/** 活动原文来自统一配置；较短手机屏可继续向上滑动阅读。 */
export function AnniversaryDetails() {
  const details = c.activities
  return <section id="chapter-4" data-chapter="4" className="chapter activities">
    <Reveal className="activities-heading">
      <p className="activities-brand">{details.title}</p>
      <h2>{details.slogan}</h2>
      <p className="activities-subtitle">{details.heading}</p>
    </Reveal>
    <Reveal className="activity-block">
      <h3>{details.lottery.title}</h3>
      <p className="activity-eligibility">{details.lottery.eligibility}</p>
      <p className="activity-draw">{details.lottery.draw}</p>
      <dl className="activity-prizes">{details.lottery.prizes.map((prize) => <div key={prize.label}>
        <dt>{prize.label}</dt><dd>{prize.reward}</dd>
      </div>)}</dl>
    </Reveal>
    <Reveal className="activity-block">
      <h3>{details.benefit.title}</h3>
      <p className="activity-benefit">{details.benefit.copy}</p>
    </Reveal>
    <Reveal className="activity-block recharge-block">
      <h3>{details.recharge.title}</h3>
      <ul>{details.recharge.offers.map((offer) => <li key={offer}>{offer}</li>)}</ul>
    </Reveal>
  </section>
}
