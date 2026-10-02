import { Reveal } from './Reveal'
import { Photo, type PhotoData } from './Photo'

export function GalleryArchive({ photos, onOpen }: { photos: readonly PhotoData[]; onOpen: (index: number) => void }) {
  return <div className="photo-archive">{photos.map((photo, index) =>
    <Reveal className="archive-item" key={`${photo.src}-${index}`} delay={Math.min(index * 0.1, 0.3)}>
      <span className="archive-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <Photo photo={photo} onClick={() => onOpen(index)} />
    </Reveal>
  )}</div>
}
