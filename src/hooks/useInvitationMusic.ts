import { useCallback, useEffect, useRef, useState } from 'react'
import { invitation as c } from '../config/invitation'

export function useInvitationMusic() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')
  const pendingRef = useRef(false)
  const userPausedRef = useRef(false)
  const play = useCallback(async (source: 'automatic' | 'user' | 'open' = 'user') => {
    const audio = audioRef.current
    if (!audio || !c.music.enabled || pendingRef.current) return
    if (source !== 'user' && userPausedRef.current) return
    // 原生 autoplay 可能先于 effect 启动；仍须应用客户确认的音量与保调速度。
    audio.volume = c.music.volume
    audio.defaultPlaybackRate = c.music.playbackRate
    audio.playbackRate = c.music.playbackRate
    audio.preservesPitch = true
    if (!audio.paused) return
    userPausedRef.current = false
    pendingRef.current = true
    setPending(true)
    setMessage('')
    try { await audio.play() } catch (error) {
      // 拒绝后关闭原生自动重试，避免迟到的播放与失败提示、用户暂停意图冲突。
      // 微信宿主就绪或后续用户操作仍通过同一个 play() 重试。
      audio.autoplay = false
      setPlaying(false)
      const blocked = error instanceof DOMException && error.name === 'NotAllowedError'
      setMessage(source === 'automatic' && blocked ? c.ui.autoplayBlocked : c.ui.musicFailed)
    } finally { pendingRef.current = false; setPending(false) }
  }, [])

  useEffect(() => {
    if (!c.music.enabled || !c.music.autoplay) return
    // 只尝试播放；浏览器仍有权拒绝有声自动播放。
    void play('automatic')
    const onBridgeReady = () => { void play('automatic') }
    let interactionAttempted = false
    const onFirstInteraction = (event: Event) => {
      if (!event.isTrusted || interactionAttempted || pendingRef.current || userPausedRef.current) return
      if (event.target instanceof Element && event.target.closest('.music-button, .open-button')) return
      if (event instanceof KeyboardEvent && event.key !== 'Enter' && event.key !== ' ') return
      interactionAttempted = true
      void play('automatic')
    }
    // 监听宿主就绪，不引入 JS-SDK，也不调用需要签名的微信接口。
    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, { once: true })
    document.addEventListener('touchend', onFirstInteraction, { passive: true, capture: true })
    document.addEventListener('click', onFirstInteraction, true)
    document.addEventListener('keydown', onFirstInteraction, true)
    return () => {
      document.removeEventListener('WeixinJSBridgeReady', onBridgeReady)
      document.removeEventListener('touchend', onFirstInteraction, true)
      document.removeEventListener('click', onFirstInteraction, true)
      document.removeEventListener('keydown', onFirstInteraction, true)
    }
  }, [play])

  const toggle = () => {
    if (pendingRef.current) return
    if (playing) {
      userPausedRef.current = true
      if (audioRef.current) audioRef.current.autoplay = false
      audioRef.current?.pause()
      setMessage('')
    } else { void play() }
  }
  return { audioRef, playing, setPlaying, pending, setPending, message, setMessage, play, toggle }
}
