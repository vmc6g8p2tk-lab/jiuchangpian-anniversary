import { useRef, useState } from 'react'
import { invitation as c } from '../config/invitation'

export function useInvitationMusic() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')
  const play = async () => {
    const audio = audioRef.current
    if (!audio || !c.music.enabled) return
    setPending(true)
    setMessage('')
    audio.volume = c.music.volume
    try { await audio.play() } catch { setPlaying(false); setMessage(c.ui.musicFailed) } finally { setPending(false) }
  }
  const toggle = () => { if (pending) return; if (playing) { audioRef.current?.pause() } else { void play() } }
  return { audioRef, playing, setPlaying, pending, setPending, message, setMessage, play, toggle }
}
