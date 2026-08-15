return {
  inject: ['timer'],
  apply(ctx) {
    const SPRITES = {"PALETTE":{"O":"#3a2416","P":"#e0a95f","D":"#b97a3c","C":"#f7e6c9","E":"#2c1a10","N":"#2c1a10","T":"#f07d9c","M":"#a03030"},"IDLE":[["................","..ODD......DDO..",".ODDPPPPPPPPDDO.",".OPPPPPPPPPPPPO.",".OPPPEEPPEEPPPO.",".OPPPEPPPEPPPPO.",".OPPPPPNNPPPPPO.",".OPPPPCCCCPPPPO.",".OPPPPCTTCCPPPO.",".OPPPPCTTCPPPO..","...OPPPPPPPPPO..","..OPPPPPPPPPPPO.",".OPPCCPPPPCCPPO.","..OOOOOOOOOOOO.."],["................","..ODD......DDO..",".ODDPPPPPPPPDDO.",".OPPPPPPPPPPPPO.",".OPPPEEPPEEPPPO.",".OPPPEPPPEPPPPO.",".OPPPPPNNPPPPPO.",".OPPPPCCCCPPPPO.",".OPPPPCTCPPPPO..","...OPPPPPPPPPO..","...OPPPPPPPPPO..","..OPPPPPPPPPPPO.",".OPPCCPPPPCCPPO.","..OOOOOOOOOOOO.."]],"DIG":[["................","....ODDDDDDO....","...ODPPPPPPDO...","..ODPPPPPPPPDO..","..OPPPEEPPEEPO..","..OPPPEPPPEPPO..","..OPPPPPNNPPPPO.","..OPPPPCCCCPPO..","...OPPPPPPPPPO..","...OPPPPPPPPPO..","..OPPPPPPPPPPPO.",".OPPPPPPPPPPPPO.","..OPCCPPPPPCCPO.","..OOOO......OOOO"],["................","....ODDDDDDO....","...ODPPPPPPDO...","..ODPPPPPPPPDO..","..OPPPEEPPEEPO..","..OPPPEPPPEPPO..","..OPPPPPNNPPPPO.","..OPPPPCCCCPPO..","...OPPPPPPPPPO..","...OPPPPPPPPPO..","..OPPPPPPPPPPPO.","..OPCCPPPPPCCPO.","..OPPPPPPPPPPPO.","..OOOO......OOOO"],["................","....ODDDDDDO....","...ODPPPPPPDO...","..ODPPPPPPPPDO..","..OPPPEEPPEEPO..","..OPPPEPPPEPPO..","..OPPPPPNNPPPPO.","..OPPPPCCCCPPO..","...OPPPPPPPPPO..","...OPPPPPPPPPO..","..OPPPPPPPPPPPO.","..OPCCPPPPPPPPO.","..OPPPPPPPPCCPO.","..OOOO......OOOO"],["................","....ODDDDDDO....","...ODPPPPPPDO...","..ODPPPPPPPPDO..","..OPPPEEPPEEPO..","..OPPPEPPPEPPO..","..OPPPPPNNPPPPO.","..OPPPPCCCCPPO..","...OPPPPPPPPPO..","...OPPPPPPPPPO..","..OPPPPPPPPPPPO.","..OPPPPPPPPCCPO.","..OPCCPPPPPPPPO.","..OOOO......OOOO"]],"BARK":[["................","..ODD......DDO..",".ODDPPPPPPPPDDO.",".OPPPPPPPPPPPPO.",".OPPPEEPPEEPPPO.",".OPPPEPPPEPPPPO.",".OPPPPPNNPPPPPO.",".OPPPPCCCCPPPPO.",".OPPPPMMMPPPPO..","...OPPPPPPPPPO..","...OPPPPPPPPPO..","..OPPPPPPPPPPPO.",".OPPCCPPPPCCPPO.","..OOOOOOOOOOOO.."],["................","..ODD......DDO..",".ODDPPPPPPPPDDO.",".OPPPPPPPPPPPPO.",".OPPPEEPPEEPPPO.",".OPPPEPPPEPPPPO.",".OPPPPPNNPPPPPO.",".OPPPPCCCCPPPPO.",".OPPPPMMMPPPPO..",".OPPPPTTTPPPO...","...OPPPPPPPPPO..","..OPPPPPPPPPPPO.",".OPPCCPPPPCCPPO.","..OOOOOOOOOOOO.."],["................","..ODD......DDO..",".ODDPPPPPPPPDDO.",".OPPPPPPPPPPPPO.",".OPPPEEPPEEPPPO.",".OPPPEPPPEPPPPO.",".OPPPPPNNPPPPPO.",".OPPPPCCCCPPPPO.",".OPPPPMMMMPPPO..",".OPPPPTTTPPPO...","...OPPPPPPPPPO..","..OPPPPPPPPPPPO.",".OPPCCPPPPCCPPO.","..OOOOOOOOOOOO.."]]}

    // Embedded bark sound (犬吠.mov -> 8kHz mono WAV, base64).
    const BARK_B64 = "UklGRtYQAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgATElTVBoAAABJTkZPSVNGVA0AAABMYXZmNjMuMS4xMDEAAGRhdGGQEAAAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgYGBgICAgICAgIGBgoKBgYCAgICAf3+AgICAgICBgYGBgICAgIB/fn5+f4CAgYGBgYGBgH9+fn5+f4CAgYKDhIaGg356eHh5e3x/goaIh4WDgX9/gYB5dHV7gYaMjYqHgn13c3J1fYKGiYmIhYF9eXt9fn5+gISFhpCThnhwb29ye36BiZCVl5GBb2lrcHR5foWSm5iSn5twVU5TXm5+g5Spr62ih2ZSVl1mc4OSoKqouLOAUjxKV2NydIemv76oimNRVF1ob3qJpb+3rK+MVTo8UV9seIqtwMKyi19BS216dHOLqrDI05BONDlRYGtjcKDC1sOSXkxsf3tnXnWZ0eOpYjc/XXeEbWF1nb2xj2ZhfJWVd3Fth8O1fkYxTHKblnl3gJiekod4foqIfoaKfZWhf1xRXmx+fXuLi396gJKpu6OFdlFEaZOXfnRzeX90cXJqZnSauMa4lpuCRjpPan+QnJKOb1Rnd3VvepawwrWkonM7P2N5fpOinoNbTlVjbH6ovsKvp619RDE/aYqmurmLQCc0UW6Fr9fr1q2KRxUiUXuRlqHX34EpDiFNirvBrIuDlXBMapq5sIRlbX1eQCwdTZ/i/+uxoqBbDAM1hLjU4LFaLlOXkmRCU5jF0bd4OEOjz55BByiO0tN5DQBc8v//lhIBLZ/OeRYAPajz/tGYi56qeBEBADiu3te3pcL0/8dJAgIDOHN+cXqy8f/ehjs9bJexjE87R2JucXNyneP/0mQUACVYcHNpiMbj4tmcRCk1SXOcusu1jWlEMCpBdK7d+P3Ofl9UNh8aO3OoysSabGJ2hYWGka24vZY3BAktX4+92+jevphjUTAMBRFEnfL/7qiCiI6dlFkPBTh2kIh3boWw0tWoibDYr18XBRBIh5SBfLHw/9l8IAAhZKK/moCvy5xsWlddZHaAeYWptZ5gGQMrftP+5tbVmlI3N0VOVnB5g6OzoHxcTFd6nbTW/vCgPAYDG2KPmZ+3292vaCoSJlKEpsDz/9B6NA0oZIZ+b4a0xZ5fJxY9hMnh0srUuXQoBiNei5mJgZu7s3s9HitlrdDKur3BnVIiIjtojJSXoKuukmZDMUN4qcTKtayyj1xAMTpSaYyosLGhfUwrOHGsycSpprmmb0EmLVF0kp2gqqqMVy0wZKXLxqytsZFtUTc3VYKhpJOJiHthSEVjkbvRy7SaiGlFNDhVha27rJJ7Z1JDRWCQwNfWuZqDZEMxLkd5q8fBpIBiTkhVc5i5x7OPgHpwcm9aTGGJqKyce1dLW3SLn661sJ2Fa1FNYHSEkpqWjH1wZF5mdICOmqWjnJeNhn1lVlljc4aTk4uGgXp2d3uBiZGTlI6DeG92fn6ChH53dHZ6fX2AhouSkop7bm17hYaKh316fIGCgIeJiIF2bmpxfISJhYSEjJeSjoVyY1pgcYSXnpqOgX18fX17d3R4fYGLkI2GenFrbn2JkpWTi4B5cWtrcXqDjpqem5ODcmdjZW54gIWMjoyIhoWEg4J+enl6enl6fYCHjIyJgnx5eXp5eHd3fYSKjIqIhIKCf4CBgYJ+enZ0dnuDiIqKh4WDgX95dXN1en+Gi42MiYR/fHt7fH59e3t+gIOEgoGCgoKEhIF7eHd3eHyAhYmMjo+Lg315dnR2eXx8fn9/goSFhoeGhIKAfXt5eHd4fIGGjJCQjIV+eXVzdHZ5fICDhoiIhoWDgoGBgYF/fHh1dHd8g4mMjYyJhYB8eXd3eXx+gYOEg4KCgoOEhIOBfnx6eXh5fH+EiIqKiYaBfXp5eXp+gYKEhYWEhIKAfn19fX5/f317eXl8gYWIiYiEgX58e3t9f4KDhoeHhIF9fHx9fn+AgH9/fXx8fX+CgoGBgYGBf39+fn+AgoOEhIOCgH5+gIKDgoKCgoGAfnx7e3x9fn9/f3+AgIGCg4ODgoKCgX9+fn1+foCDhIWFg4F/fn+AgoKCgoGAfnx7e3x9fn9/f39/f4CBgoSFhISDgYB/fXx8foCBgoKCgoGBgYGBgYGBgYGBgH58e3t7fX6AgYKCgYGBgYGBgICBgYGBgH9/f4CBgYGAgIB/gIGCgoODgYCAf35+f39+f4B/f35+fX1/gIGCg4KBgYGAgH9/fn5/gIGBgoKBgYGBgYKCgYGAgYGAf39+fX5/gICAgH9/f39/gH9/f39/gICAgICAgIGBgYGBgYCAgIGCgYGBgICBgoKCgoGAgH9/f39/f39/gIGAf35+fn5+gIGAf4B/f4CAgH+AgYCAgICAf4CAgIGBgoODgoGBgICAgICAgYGBgYGAf39/f3+AgICAgICAgIB/f39/f39/fn5+f4CAgIGBgYGBgYCBgYGBgYGBgYGAgICBgYGBgIB/f35+f4CBgYGCgYF/fn19fX5+f3+AgIGBgICAgICBgICAgICAf4CBgoODgoKBgYGAf35+f4CAgYGBgYCAf39/f39/fn5/f39/f4CAgICAgICAf39/f4CAgYGBgYGCgoGBgICBgYKBgYB/f39/gICAgIB/f39/f39/gICBgYGBgH5+fn9/gICAgYGBgYGBgICAgYGBgYGBgICAgIGBgYGBgH9+fn9/fn5/gIGBgYCAf39/f39/f3+AgIB/gICAgYGBgYGBgYCAgICAgYKBgYKCgYGBgIB/f39/f39/f39/f4CBgYGAgH9/fn5+f3+AgICBgYGAgH+AgIGBgYGBgYGBgICAgYGBgYGAgH9/fn5+f3+AgYGBgYB/f39/f4B/f39/f39/gICAgYGBgYGAgICAgYGBgYGBgYGAgH9/fn5+f4CAgYGBgYGAgICAf35/f39/gICBgoKCgYGBgICAf39/gICAgIB/f39/f3+AgICBgYGAgYGAgICBgIB/f35/f4CAgYKCgoKCgYCAf39/gICAgYB/f358e31+f4GEhYWFhYOAfn17e319foCCg4OEhIODgoB/fn18fX5/gIKDhIOBf317enl6fYCChYaHhoWDgH59fHx9fn+AgYKCgoKCgoODgoKBfnx8e3p6fH1+gIKDg4OEg4KCgYCAgH9/f4CAgYKDgoODgYB/fn19fn9/fnx7e3x+gYSGh4aFgn98e3p7foCCg4SEhIOCgYCBgYGCgX58e3p6en1/gYSGhIOCgX9+f39/f4CAf39/f3+AgoOEhYWEgoB+fHx8e3t9gYSGh4aEgn98eXh5enx+gIGDhISDhIaIh4aCfnt5eHZ2eHt/hImNkJKPh311cGxtcnh/hImLjIqJh4WEgHt3dnd4eXyAgoOHj5KNhX96dHBtbG96h5GXmZSMhH97dW9ra250eYKRnqGdk4V1aGRma3N8gYeLjYyLioeEhY2PhHVtaGJkcoGOnKWdiHZrY2JufYiSnJ6Yh3VudHyBg35zb3qCfHmDjZCVlYRqX2x8f3x6f4uVm5+VgnqEi35lWVtkeJGZkIZ+dGpse4mZrr6zjGJRWGdzd3Z3f46UiHZtc42vuZ1yWl1ncHZ3dX+MmaipnZKQi3NTQ0teeZKYj4J0amp4iZSv19miXTxDWnODe2ZnhJ2bhGxpf6jIvYlaUV1qcGxhXnOWssXPupR9cFs/NEdoiKKomHxdR1J8rd702JZZP1VwcFxJUGh5ipWNi63X3bR2QzNJaXBTPk94ptby5b2ciG9MLyk/YYaXjHJlXFhdkeT/9r+TeFc0KS40SXaZi3KMwt/UqnRQTnOKbDgdM2Cj6v/pqYJ1Y01RbHJrcm9UQDlMfdf//tyzoH1GFQofNFyOmIJ2mNDt1qZ4YmtzWzMYJ1mGuunlxq+ilHtnYVlJSVE8ICVYpPL//+eggXJWHAACEESTu6WJk7fNyLWUa2eAcTACDU2TzuzYrKazqY1jQzMvODYiLF6y/v//3JyDYS4JDBoxbbjMnnN0k6Wvwb2ci4htMxAsYoujrKaw0Neyd1BCOzc6KSNOtf///9KeeFExGRw3VYS2soNYVnWPp8rawJFzYks3OVZ1gYefvMvDonVTSVZcSSovXcL///mwb0s3KS5LaYq1xKFoR05ohrPY17CJeW1ZRjw9SnS7592zg1pHT2RgSUp0sOX95aJcOz5JXH2RiYSUlndQQ1Z6rOD1z5R1Z085MjhOgMLx4q16TDI6W2hldJ3S8uWwbTsxRmCFpKKIfXxuVURKZpTT+/K/iWZBJyY3TXW16+i0fFU4NE1ndoWiz+vZo2M0LkhpkK6tmoZ3ZUg4PFSE0v/705doNhAQMlaExfn6vHZFJCM/Z4ukwODmwIA/GR9Hfa7GvZ+AaFlHOUJglNf/+MJ+SiQSJVR9nLvd4rh7RiouS3SZrLrKxqZzOhglYarU0al7YWRtXDYtU6Hz//usTS0uMzROe6rS4LlxPDFOdIydrrvHw6BmNiEsUn+nt6aDa3GYwb6VbFNGSl93g4Wiy9CqdEo3PmCNqKykmH9dSEdfj8bm2KdtRTc6TGZ/nri6o4BkXGeErL24pHpJKig+Wnio3/rtwodTNzZETlp0k6atsq+Ye2tsdHuDh4B1bmxpa3WFmaqwrqONdmJTSklQYoCkx9TCm3NfXmRlX2N2jZuZi35/kKKhiXNvdXRoXFVefqrHv6GJgHhvZVxWXnmWnZCGipGTkpCGeHN4dmVWXHKLn6uol4uMi35rYWFkZ3F9hIuaqq2hk4Z1YVddaG92go6TlZmYj4aGiIN3cG5sZ2lyf4yZpKWcjoN6cGdmbHF0eYGLkpSVkYuHhYN8c25ucHJ1fYWOlJeWjoaBfHZwbnF0eH6EiImLjYyJhIB+fHt7e3h2dnp/g4eLjo2KhYB7eHd4eXx/g4SFhYWEg4KCgoGBgH58enp7fYGFiImIhoN/e3l6fH+CgoGAfn9/gYKEhYSCgH9+fn+AgYGCg4OCgX9+f3+AgYCAgICAgYKDg4ODgoB+fX1/gYOEgoB/fn19foGFh4aEgH18e31/gYODgoF/fn19gIOFhYSCgH59fn5/gIKDgoB/f35/gIGCgoKBgYGBgICAgICAgICAgIGBgYGBgH+AgIGCg4KBf35+f3+AgoOEg4B+fX5+f4CCg4OEg4F/fn5+f4CAgYKCgX9/f4CBgoKBgICAf35/gIGCg4KBgH9+fn5/gH+AgoOCgYGAgICBgYB/f35+f4GCg4SDgoB/fn5/f4CAgYGBgYGBgoKBgYF/fn59fn+Bg4SDgoGAgIB/f35/gIGBgH+AgYKBgYKCgYB/fn5/gICAgYKCgoKAf3+AgH9/gIGBgYCAgIGAgICBgYGAf4CAgIGBgYGBgIB/f4CBgoKBgYCAf4CAgICAgIGBgICAgICAgYGBgIB/f4CAgH+AgICBgoKBgYGAf35+f3+AgICBgoKBgICAgICAgICAf39/gICAgYKCgYCAgH9/f4CAf4CAgYGBgIGBgYGAf39/f3+AgIGBgYKBgICAgICAgICAgH9/f4CBgYKCgYGAgIB/f39/gICAgIGBgYGBgYB/gH9/f3+AgICAgIGBgYGBgIB/f39/f3+AgYGBgYGBgICAgICAgICAgICAgIGBgYGBgICAf3+AgICAgICBgYGBgH9/gICAgICAgIGBgH+AgICBgICAgICAgICAgICBgICAgICAgYGAgICAgICBgYGBgICAgA=="

    function spriteRects(frame) {
      const rects = []
      for (let y = 0; y < frame.length; y++) {
        const row = frame[y]
        for (let x = 0; x < row.length; x++) {
          const ch = row[x]
          if (ch === '.') continue
          rects.push(React.createElement('rect', {
            key: x + ',' + y,
            x: x, y: y, width: 1, height: 1,
            fill: SPRITES.PALETTE[ch],
          }))
        }
      }
      return rects
    }

    function phaseOf(status) {
      return status === 'running' ? 'digging' : 'idle'
    }

    // ---- audio: plays the real 犬吠.mov sound; synthesized bark as fallback ----
    function makeBark() {
      let ac = null
      let unlocked = false
      let buffer = null
      let loading = null

      function ensure() {
        if (ac) return ac
        const G = typeof window === 'undefined' ? undefined : (window.AudioContext || window.webkitAudioContext)
        if (!G) return null
        ac = new G()
        return ac
      }

      function b64ToBytes(b64) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
        const out = new Uint8Array(Math.floor(b64.length * 3 / 4))
        let p = 0
        let bits = 0
        let acc = 0
        for (let i = 0; i < b64.length; i++) {
          const c = b64.charAt(i)
          if (c === '=') break
          const v = chars.indexOf(c)
          if (v < 0) continue
          acc = (acc << 6) | v
          bits += 6
          if (bits >= 8) {
            bits -= 8
            out[p++] = (acc >> bits) & 0xff
          }
        }
        return out
      }

      function loadFile() {
        if (loading) return loading
        loading = new Promise(function (resolve) {
          const a = ensure()
          if (!a) return resolve(null)
          try {
            const bytes = b64ToBytes(BARK_B64)
            const ab = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
            a.decodeAudioData(ab, function (buf) { buffer = buf; resolve(buf) }, function () { resolve(null) })
          } catch (e) { resolve(null) }
        })
        return loading
      }

      // Call from a user gesture to satisfy the browser autoplay policy, then
      // preload + decode the WAV once so playback is instant later.
      function prime() {
        try {
          const a = ensure()
          if (!a) return
          if (a.state === 'suspended') {
            a.resume().then(function () { unlocked = true; loadFile() }).catch(function () {})
          } else {
            unlocked = true
            loadFile()
          }
        } catch (e) { /* ignore */ }
      }

      function playBuffer() {
        if (!buffer || !ac) return
        const src = ac.createBufferSource()
        src.buffer = buffer
        src.connect(ac.destination)
        src.start(0)
      }

      // Compact synthesized fallback (only used when the file can't be read).
      function playSynth() {
        const a = ac
        if (!a) return
        const now = a.currentTime
        const dur = 0.25
        const buf = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate)
        const d = buf.getChannelData(0)
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length)
        const src = a.createBufferSource()
        src.buffer = buf
        const bp = a.createBiquadFilter()
        bp.type = 'bandpass'
        bp.Q.value = 1
        bp.frequency.setValueAtTime(600, now)
        bp.frequency.exponentialRampToValueAtTime(200, now + dur)
        const g = a.createGain()
        g.gain.setValueAtTime(0.5, now)
        g.gain.exponentialRampToValueAtTime(0.0001, now + dur)
        src.connect(bp)
        bp.connect(g)
        g.connect(a.destination)
        src.start(now)
      }

      function play() {
        try {
          const a = ensure()
          if (!a) return
          if (a.state === 'suspended') a.resume().catch(function () {})
          if (a.state !== 'running') return
          if (buffer) { playBuffer(); return }
          loadFile().then(function (buf) {
            if (buf) playBuffer()
            else playSynth()
          })
        } catch (e) { /* sound is a bonus; never break the pet */ }
      }

      return { play: play, prime: prime, isUnlocked: function () { return unlocked } }
    }

    const barkAudio = makeBark()

    // Prime audio on the first user interaction anywhere on the page, so a
    // completion bark (which fires without a gesture) has an unlocked clock.
    ctx.effect(function () {
      if (typeof window === 'undefined') return function () {}
      function unlock() { barkAudio.prime() }
      window.addEventListener('pointerdown', unlock, { once: true, passive: true })
      window.addEventListener('keydown', unlock, { once: true, passive: true })
      return function () {
        window.removeEventListener('pointerdown', unlock)
        window.removeEventListener('keydown', unlock)
      }
    })

    function Pet() {
      const [remote, setRemote] = React.useState({ status: 'idle', runningCount: 0, completionCount: 0 })
      const [phase, setPhase] = React.useState('idle')
      const [frame, setFrame] = React.useState(0)
      const [pos, setPos] = React.useState(null)
      const [drag, setDrag] = React.useState(null)
      const [unlocked, setUnlocked] = React.useState(barkAudio.isUnlocked())

      const remoteRef = React.useRef(remote)
      const phaseRef = React.useRef(phase)
      const prevCompletionRef = React.useRef(0)
      const lastBarkRef = React.useRef(0)
      const barkTimerRef = React.useRef(null)
      const movedRef = React.useRef(0)

      const dirt = React.useMemo(function () {
        return [
          { dx: '-34px', dy: '-26px', d: '0s', c: '#8a5a2b' },
          { dx: '30px', dy: '-22px', d: '0.12s', c: '#c99a63' },
          { dx: '-22px', dy: '-38px', d: '0.24s', c: '#a5713d' },
          { dx: '26px', dy: '-40px', d: '0.05s', c: '#8a5a2b' },
          { dx: '-12px', dy: '-16px', d: '0.31s', c: '#c99a63' },
          { dx: '14px', dy: '-18px', d: '0.18s', c: '#a5713d' },
        ]
      }, [])

      function startBark() {
        setPhase('bark')
        barkAudio.play()
        if (barkTimerRef.current) { barkTimerRef.current() }
        barkTimerRef.current = ctx.timeout(function () {
          barkTimerRef.current = null
          setPhase(phaseOf(remoteRef.current.status))
        }, 1900)
      }

      phaseRef.current = phase
      remoteRef.current = remote

      // Poll the Host for task state.
      React.useEffect(function () {
        let alive = true
        function poll() {
          host.call('pet-state').then(function (s) {
            if (!alive || !s || typeof s !== 'object') return
            remoteRef.current = s
            setRemote(s)
            const prev = prevCompletionRef.current
            prevCompletionRef.current = s.completionCount
            if (s.completionCount > prev) {
              const now = Date.now()
              if (now - lastBarkRef.current > 2500) {
                lastBarkRef.current = now
                startBark()
              }
            } else if (phaseRef.current !== 'bark') {
              setPhase(phaseOf(s.status))
            }
          }).catch(function () {})
        }
        poll()
        const dispose = ctx.interval(poll, 800)
        return function () {
          alive = false
          dispose()
          if (barkTimerRef.current) { barkTimerRef.current(); barkTimerRef.current = null }
        }
      }, [])

      // Advance animation frames + reflect the audio-unlock state.
      React.useEffect(function () {
        const dispose = ctx.interval(function () {
          setFrame(function (f) { return f + 1 })
          setUnlocked(barkAudio.isUnlocked())
        }, 140)
        return dispose
      }, [])

      const frames = phase === 'bark' ? SPRITES.BARK : (phase === 'digging' ? SPRITES.DIG : SPRITES.IDLE)
      const current = frames[frame % frames.length]
      const caption = phase === 'bark'
        ? '任务完成，汪！'
        : (phase === 'digging'
          ? (remote.runningCount > 1 ? '工作中 ×' + remote.runningCount : '工作中…')
          : (unlocked ? '休息中…' : '休息中… · 点我发声'))

      function basePos() {
        const W = typeof window === 'undefined' ? 1280 : window.innerWidth
        const H = typeof window === 'undefined' ? 800 : window.innerHeight
        return { x: W - 146, y: H - 162 }
      }

      function onPointerDown(e) {
        barkAudio.prime()
        if (!e.currentTarget.setPointerCapture) return
        e.preventDefault()
        e.currentTarget.setPointerCapture(e.pointerId)
        const base = pos || basePos()
        movedRef.current = 0
        setDrag({ id: e.pointerId, dx: e.clientX - base.x, dy: e.clientY - base.y, sx: e.clientX, sy: e.clientY })
      }
      function onPointerMove(e) {
        if (!drag || e.pointerId !== drag.id) return
        movedRef.current = Math.max(movedRef.current,
          Math.abs(e.clientX - drag.sx) + Math.abs(e.clientY - drag.sy))
        setPos({ x: e.clientX - drag.dx, y: e.clientY - drag.dy })
      }
      function onPointerUp(e) {
        if (drag && e.pointerId === drag.id) setDrag(null)
      }
      function onClick() {
        barkAudio.prime()
        if (movedRef.current <= 5) startBark()
      }

      const rootStyle = pos
        ? { left: pos.x, top: pos.y }
        : { right: 18, bottom: 26 }

      return React.createElement('div', {
        className: 'dshpet-root' + (drag ? ' dshpet-drag' : '') + (phase === 'digging' ? ' dshpet-digging' : ''),
        style: rootStyle,
        title: 'DSH 桌宠小汪 · 点击会叫 · 拖动可移动',
        onPointerDown: onPointerDown,
        onPointerMove: onPointerMove,
        onPointerUp: onPointerUp,
        onClick: onClick,
      },
        phase === 'bark'
          ? React.createElement('div', { className: 'dshpet-bubble' }, '汪！')
          : null,
        React.createElement('div', { className: 'dshpet-pet' },
          phase === 'digging'
            ? dirt.map(function (p, i) {
                return React.createElement('span', {
                  key: i,
                  className: 'dshpet-dirt',
                  style: { background: p.c, animationDelay: p.d, '--dx': p.dx, '--dy': p.dy },
                })
              })
            : null,
          React.createElement('svg', {
            viewBox: '0 0 16 14',
            width: 128,
            height: 112,
            shapeRendering: 'crispEdges',
            'aria-label': 'pixel puppy',
          }, spriteRects(current)),
        ),
        React.createElement('div', { className: 'dshpet-caption' }, caption),
      )
    }

    styles.insert('.dshpet-root{position:fixed;z-index:2147483000;display:flex;flex-direction:column;align-items:center;gap:5px;cursor:grab;user-select:none;-webkit-user-select:none;touch-action:none;pointer-events:auto;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;}.dshpet-root.dshpet-drag{cursor:grabbing;}.dshpet-pet{position:relative;}.dshpet-pet svg{display:block;filter:drop-shadow(0 3px 4px rgba(20,16,12,.3));image-rendering:pixelated;}.dshpet-caption{font-size:11px;line-height:1.4;color:#fff;background:rgba(24,18,12,.74);padding:2px 9px;border-radius:9px;white-space:nowrap;letter-spacing:.3px;backdrop-filter:blur(2px);}.dshpet-root.dshpet-digging .dshpet-pet{animation:dshpet-bob .34s ease-in-out infinite alternate;}.dshpet-root.dshpet-digging .dshpet-caption{background:rgba(122,74,24,.85);}@keyframes dshpet-bob{from{transform:translateY(0);}to{transform:translateY(3px);}}.dshpet-bubble{position:relative;font-size:17px;font-weight:800;color:#a03030;background:#fff;border:2px solid #3a2416;padding:4px 11px;border-radius:13px;box-shadow:0 3px 10px rgba(0,0,0,.22);white-space:nowrap;animation:dshpet-pop .38s cubic-bezier(.2,1.6,.4,1);}.dshpet-bubble::after{content:"";position:absolute;bottom:-9px;left:50%;margin-left:-7px;border:7px solid transparent;border-top-color:#fff;}.dshpet-bubble::before{content:"";position:absolute;bottom:-13px;left:50%;margin-left:-8px;border:8px solid transparent;border-top-color:#3a2416;}@keyframes dshpet-pop{0%{transform:scale(.2);opacity:0;}60%{transform:scale(1.18);opacity:1;}100%{transform:scale(1);}}.dshpet-dirt{position:absolute;bottom:24px;left:50%;width:6px;height:6px;border-radius:1px;pointer-events:none;animation:dshpet-fly .55s ease-out infinite;}@keyframes dshpet-fly{0%{transform:translate(-50%,0) scale(1);opacity:1;}100%{transform:translate(calc(-50% + var(--dx)),var(--dy)) scale(.35);opacity:0;}}')

    const slots = ctx.get('slots')
    if (slots === undefined) return
    slots.inject('shell.overlay', function () {
      return slots.register(
        { name: 'shell.overlay', id: 'dsh-dog-pet', order: 9999 },
        function () { return React.createElement(Pet) },
      )
    })
  },
}
