import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { invitation } from '../config/invitation'
import { Photo, type PhotoData } from './Photo'

export function PhotoLightbox({ photos, index, onChange, onClose }: {
  photos: readonly PhotoData[]; index: number; onChange: (index: number) => void; onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()
  const length = photos.length
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => previous?.focus()
  }, [])
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onChange((index + 1) % length)
      if (event.key === 'ArrowLeft') onChange((index + length - 1) % length)
      if (event.key === 'Tab') {
        const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.lightbox button:not(:disabled)'))
        const current = buttons.indexOf(document.activeElement as HTMLButtonElement)
        event.preventDefault()
        buttons[(current + (event.shiftKey ? buttons.length - 1 : 1)) % buttons.length]?.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [index, length, onChange, onClose])
  return <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={photos[index].caption}
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.25 }} onClick={onClose}>
    <button ref={closeRef} className="lightbox-close" aria-label={invitation.ui.close} onClick={onClose}>×</button>
    <div className="lightbox-content" onClick={(event) => event.stopPropagation()}>
      <Photo key={photos[index].src} photo={photos[index]} />
      <div className="lightbox-controls">
        <button disabled={length < 2} aria-label={invitation.ui.previous} onClick={() => onChange((index + length - 1) % length)}>←</button>
        <span>{index + 1} / {length}</span>
        <button disabled={length < 2} aria-label={invitation.ui.next} onClick={() => onChange((index + 1) % length)}>→</button>
      </div>
    </div>
  </motion.div>
}
