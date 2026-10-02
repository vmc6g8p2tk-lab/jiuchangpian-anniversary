// 独立测试入口，不进入正式 index.html 或 dist。
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { GalleryArchive } from '../../src/components/GalleryArchive'
import { PhotoLightbox } from '../../src/components/PhotoLightbox'
import { invitation } from '../../src/config/invitation'
import '../../src/styles.css'

function GalleryFixture() {
  const [index, setIndex] = useState<number | null>(null)
  const count = Number(new URLSearchParams(location.search).get('count') || 3)
  const photos = Array.from({ length: count }, (_, i) => ({ ...invitation.gallery.photos[i % 3], caption: `测试照片 ${i + 1}` }))
  return <div className="invitation-shell"><main className="chapters"><section className="chapter gallery">
    <GalleryArchive photos={photos} onOpen={setIndex} />
  </section></main>{index !== null && <PhotoLightbox photos={photos} index={index} onChange={setIndex} onClose={() => setIndex(null)} />}</div>
}
createRoot(document.getElementById('root')!).render(<GalleryFixture />)
