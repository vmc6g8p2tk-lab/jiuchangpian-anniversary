import { invitation as c } from '../config/invitation'
import { Record } from './Record'
import type { useInvitationMusic } from '../hooks/useInvitationMusic'

export function MusicPlayer({ music }: { music: ReturnType<typeof useInvitationMusic> }) {
  return <>
    <audio ref={music.audioRef} src={`${import.meta.env.BASE_URL}${c.music.src}`} loop preload="none" onPlay={() => music.setPlaying(true)} onPause={() => music.setPlaying(false)} onError={() => { music.setPlaying(false); music.setPending(false); music.setMessage(c.ui.musicFailed) }} />
    <button className="music-button" onClick={music.toggle} aria-label={music.pending ? c.ui.loadingMusic : music.playing ? c.ui.pause : c.ui.play} aria-pressed={music.playing} disabled={music.pending || !c.music.enabled} title={c.music.label}>
      <Record spinning={music.playing} className="mini-record" /><span className="music-state" aria-hidden="true">{music.playing ? 'Ⅱ' : '♪'}</span>
    </button>
    <div className={`music-notice ${music.message ? 'visible' : ''}`} role="status" aria-live="polite">{music.message}</div>
  </>
}
