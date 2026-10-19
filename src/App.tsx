import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { invitation as c } from './config/invitation'
import { Record } from './components/Record'
import { Reveal } from './components/Reveal'
import { MusicPlayer } from './components/MusicPlayer'
import { useInvitationMusic } from './hooks/useInvitationMusic'
import { Photo } from './components/Photo'
import { BrandLogo } from './components/BrandLogo'
import { GalleryArchive } from './components/GalleryArchive'
import { AnniversaryDetails } from './components/AnniversaryDetails'
import { PhotoLightbox } from './components/PhotoLightbox'

function SmallIcon({ type }: { type: string }) {
  const paths: Record<string, React.ReactNode> = {
    record: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
    guitar: <><path d="m15 9 6-6m-5 2 3 3M14 10c-2-2-5-2-6 1-4 0-5 4-2 7s7 2 7-2c3-1 3-4 1-6Z" /><circle cx="10" cy="14" r="2" /></>,
    glass: <><path d="M5 3h14l-2 9c-1 5-9 5-10 0L5 3Zm7 13v5m-4 0h8M6 8h12" /></>,
    friends: <><circle cx="9" cy="7" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 5v2" /></>,
    star: <path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" />,
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type] ?? paths.record}</svg>
}

export default function App() {
  const [active, setActive] = useState(0)
  const [opened, setOpened] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const mainRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const music = useInvitationMusic()
  const goTo = (index: number) => document.getElementById(`chapter-${index}`)?.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'start' })
  const openInvitation = () => { setOpened(true); void music.play(); goTo(1) }

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(Number((visible.target as HTMLElement).dataset.chapter))
    }, { root: mainRef.current, threshold: [0.25, 0.5, 0.7] })
    mainRef.current?.querySelectorAll('.chapter').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])


  return <div className={`invitation-shell tone-${active}`}>
    <aside className="desktop-note" aria-hidden="true"><span>{c.brand.english}</span><div className="note-line" /><p>{c.cover.label}</p><small>{c.ui.demo}</small></aside>
    <header className="fixed-header" inert={lightbox !== null}><a href="#chapter-0" onClick={(e) => { e.preventDefault(); goTo(0) }} aria-label={c.brand.name}><BrandLogo /></a><MusicPlayer music={music} /></header>
    <main className="chapters" ref={mainRef} aria-label={c.share.title} tabIndex={-1} inert={lightbox !== null}>
      <section id="chapter-0" data-chapter="0" className="chapter cover">
        <div className="paper-top"><span>{c.cover.kicker}</span><span>{c.edition}</span></div>
        <Reveal className="cover-heading"><BrandLogo variant="cover" /><div className="cover-title"><h1>{c.brand.name}</h1><span>{c.cover.title}</span></div><p className="cover-date">{c.event.date}<span>{c.cover.english}</span></p></Reveal>
        <div className="turntable-scene"><div className="record-shadow" /><Record className="hero-record" /><div className="tonearm" aria-hidden="true"><i /><span /></div><motion.div className="anniversary-number" initial={reduce ? false : { opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.4 }}>{c.cover.number}<span>{c.cover.numberSuffix}</span></motion.div><span className="record-side">{c.cover.side}</span></div>
        <Reveal className="cover-quote" delay={0.4}><h2>{c.cover.gratitude}</h2><span className="small-star" aria-hidden="true">✳</span></Reveal>
        <Reveal className="cover-ticket" delay={0.7}><div><span>{c.cover.ticketEnglish}</span><strong>{c.cover.ticket}</strong><small>{c.cover.footer}</small></div><button className="open-button" onClick={openInvitation}>{c.ui.open}<span aria-hidden="true">↓</span></button></Reveal>
        <button className="swipe-hint" onClick={() => goTo(1)}><span>{c.ui.swipe}</span><i aria-hidden="true" /></button>
      </section>

      <section id="chapter-1" data-chapter="1" className="chapter story">
        <Reveal><p className="eyebrow">{c.story.kicker}</p><h2>{c.story.title}</h2></Reveal>
        <div className="story-copy">{c.story.lines.map((line, index) => <Reveal delay={index * 0.06} key={index}>{line ? <p>{line}</p> : <div className="verse-space" />}</Reveal>)}</div>
        <Reveal className="story-memory"><div className="date-stamp">{c.story.stamp}<span>{c.cover.english}</span></div><Photo photo={{ src: c.story.photo, webp: c.story.photoWebp, avif: c.story.photoAvif, alt: c.story.photoAlt, caption: c.story.photoCaption, placeholder: c.story.placeholder }} /><p className="handwritten">{c.story.note}</p></Reveal>
        <div className="chapter-foot"><span>{c.brand.english}</span><span>01 — 02</span></div>
      </section>

      <section id="chapter-2" data-chapter="2" className="chapter gallery">
        <Reveal><p className="eyebrow">{c.gallery.kicker}</p><h2>{c.gallery.title}</h2><div className="gallery-copy">{c.gallery.copy.map((line) => <p key={line}>{line}</p>)}</div></Reveal>
        <GalleryArchive photos={c.gallery.photos} onOpen={setLightbox} />
        <p className="gallery-hint">{c.ui.photoHint} <span aria-hidden="true">↗</span></p>
        <div className="chapter-foot"><span>{c.brand.english}</span><span>01 — 03</span></div>
      </section>

      <section id="chapter-3" data-chapter="3" className="chapter celebration">
        <div className="celebration-record" aria-hidden="true"><Record /></div>
        <Reveal><p className="eyebrow">{c.celebration.kicker}</p><p className="celebration-english">{c.celebration.english}</p><h2>{c.celebration.title}</h2><p className="celebration-intro">{c.celebration.intro}</p>{c.celebration.pending && <p className="pending-badge">{c.celebration.pendingLabel}</p>}</Reveal>
        <div className="programme">{c.celebration.items.map((item, index) => <Reveal key={item.number} delay={index * 0.08}><div className="programme-row"><span className="programme-number">{item.number}</span><div><h3>{item.title}</h3><p>{item.subtitle}</p></div><SmallIcon type={item.icon} /></div></Reveal>)}</div>
        <Reveal className="celebration-sign"><span className="anniversary-seal">{c.celebration.seal}<b>1</b></span><p>{c.celebration.footer}</p></Reveal>
      </section>

      <AnniversaryDetails />

      <section id="chapter-5" data-chapter="5" className="chapter formal">
        <Reveal><p className="eyebrow">{c.event.kicker}</p><h2>{c.event.title}</h2><p className="formal-subtitle">{c.event.subtitle}</p></Reveal>
        <Reveal className="event-ticket"><div className="ticket-header"><span>{c.event.ticketTitle}</span><small>{c.event.ticketNumber}</small></div><p className="ticket-date">{c.event.date}<span>{c.cover.title}</span></p><dl>{(['time', 'venue', 'address'] as const).map((field) => <div key={field}><dt>{c.event.fields[field]}</dt><dd>{c.event[field]}</dd></div>)}</dl><div className="ticket-tear"><span>{c.brand.name}</span><div className="barcode" aria-hidden="true" /></div></Reveal>
        <div className="invitation-copy">{c.event.copy.map((line, index) => <Reveal delay={index * 0.06} key={line}><p>{line}</p></Reveal>)}<Reveal delay={0.3}><p className="closing-copy">{c.event.closing}</p></Reveal></div>
        <Reveal className="location-card"><div className="location-heading"><span aria-hidden="true">⌖</span><div><strong>{c.event.addressLabel}</strong><p>{c.event.address}</p></div></div><div className="event-actions">{c.event.navigationUrl ? <a href={c.event.navigationUrl} target="_blank" rel="noopener noreferrer">{c.ui.map}<span aria-hidden="true">↗</span></a> : <button disabled title={c.ui.navigationPending}>{c.ui.map}<span aria-hidden="true">↗</span></button>}</div></Reveal>
      </section>

      <section id="chapter-6" data-chapter="6" className="chapter ending">
        <Reveal><p className="eyebrow">{c.ending.kicker}</p></Reveal>
        <Reveal className="ending-record"><Record /><span className="ending-seal">{c.ending.anniversary}</span></Reveal>
        <Reveal className="ending-copy"><h2>{c.ending.title}</h2>{c.ending.lines.map((line) => <p key={line}>{line}</p>)}<span className="ending-english">{c.ending.english}</span></Reveal>
        <Reveal className="ending-brand"><BrandLogo variant="ending" /><h3>{c.brand.name}</h3><p>{c.ending.dateLabel} · {c.event.date}</p><span>{c.ending.signoff}</span></Reveal>
        <button className="replay-button" onClick={() => goTo(0)}>{c.ui.back}<span aria-hidden="true">↑</span></button>
      </section>
    </main>
    <nav className="chapter-nav" aria-label={c.navigationLabel} inert={lightbox !== null}>{c.navigation.map((name, index) => <button key={name} className={active === index ? 'active' : ''} onClick={() => goTo(index)} aria-label={`${index + 1}. ${name}`} aria-current={active === index ? 'step' : undefined}><span /></button>)}</nav>
    <div className="page-counter" aria-hidden="true"><span>{String(active + 1).padStart(2, '0')}</span><i />{String(c.navigation.length).padStart(2, '0')}</div>
    <div className="grain" aria-hidden="true" />
    <AnimatePresence>{lightbox !== null && <PhotoLightbox photos={c.gallery.photos} index={lightbox} onChange={setLightbox} onClose={() => setLightbox(null)} />}</AnimatePresence>
    <span className="sr-only" aria-live="polite">{opened ? c.navigation[active] : ''}</span>
  </div>
}
