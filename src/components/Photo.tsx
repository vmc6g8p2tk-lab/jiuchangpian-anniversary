import { useState } from 'react'
import { invitation } from '../config/invitation'
export type PhotoData = { src: string; alt: string; caption: string; placeholder?: string; avif?: string; webp?: string }
export function Photo({ photo, onClick, className = '' }: { photo: PhotoData; onClick?: () => void; className?: string }) {
  const [failed, setFailed] = useState(false)
  const content = <>
    <div className="photo-image">
      {failed ? <div className="photo-fallback">{invitation.ui.imageFailed}</div> : <picture>
        {photo.avif && <source type="image/avif" srcSet={`${import.meta.env.BASE_URL}${photo.avif}`} />}
        {photo.webp && <source type="image/webp" srcSet={`${import.meta.env.BASE_URL}${photo.webp}`} />}
        <img src={`${import.meta.env.BASE_URL}${photo.src}`} alt={photo.alt} loading="lazy" decoding="async" width="800" height="600" onError={() => setFailed(true)} />
      </picture>}
      {photo.placeholder && <span className="placeholder-label">{photo.placeholder}</span>}
    </div>
    <span className="photo-caption">{photo.caption}</span>
  </>
  return onClick ? <button className={`polaroid ${className}`} onClick={onClick} aria-label={photo.caption}>{content}</button> : <figure className={`polaroid ${className}`}>{content}</figure>
}
