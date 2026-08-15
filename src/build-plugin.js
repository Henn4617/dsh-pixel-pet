// Builds host.body.js / client.body.js from the verified sprite data.
// The produced files are the `code.host` / `code.client` function bodies for cordis_define.
const fs = require('fs')
const s = require('./sprites')

const SPRITE_JSON = JSON.stringify({
  PALETTE: s.PALETTE,
  IDLE: [s.IDLE_A, s.IDLE_B],
  DIG: [s.DIG_1, s.DIG_2, s.DIG_3, s.DIG_4],
  BARK: [s.BARK_1, s.BARK_2, s.BARK_3],
})

// The bark sound (犬吠.mov, trimmed + 8kHz 8-bit PCM WAV) embedded as
// base64 so the Client needs no filesystem or network access to play it.
const BARK_B64 = fs.readFileSync('../assets/bark.wav').toString('base64')
const BARK_B64_LIT = JSON.stringify(BARK_B64)

// ---------------------------------------------------------------------------
// HOST half
// ---------------------------------------------------------------------------
const hostBody = `return {
  apply(ctx) {
    // Tracks every live agent in the process. A "task" is an agent whose
    // driver is running; a completion is an agent leaving running -> idle.
    const runningSince = new Map() // Agent -> timestamp when it started running
    let runningCount = 0
    let completionCount = 0
    let lastCompletionAt = 0

    function markRunning(agent) {
      if (!agent || runningSince.has(agent)) return
      runningSince.set(agent, Date.now())
      runningCount += 1
    }

    function markIdle(agent) {
      if (!agent) return
      const started = runningSince.get(agent)
      if (started === undefined) return
      runningSince.delete(agent)
      runningCount = Math.max(0, runningCount - 1)
      // Ignore sub-second blips (idle flapping between steps of one turn).
      if (Date.now() - started >= 800) {
        completionCount += 1
        lastCompletionAt = Date.now()
      }
    }

    ctx.on('agent/status', function (payload) {
      const p = payload || {}
      if (p.status === 'running') markRunning(p.agent)
      else markIdle(p.agent)
    })

    ctx.on('agent/disposed', function (payload) {
      markIdle((payload || {}).agent)
    })

    harness.handle('pet-state', function () {
      return {
        status: runningCount > 0 ? 'running' : 'idle',
        runningCount: runningCount,
        completionCount: completionCount,
        lastCompletionAt: lastCompletionAt,
      }
    })
  },
}
`

// ---------------------------------------------------------------------------
// CLIENT half
// ---------------------------------------------------------------------------
const clientBody = `return {
  inject: ['timer'],
  apply(ctx) {
    const SPRITES = ${SPRITE_JSON}

    // Embedded bark sound (犬吠.mov -> 8kHz mono WAV, base64).
    const BARK_B64 = ${BARK_B64_LIT}

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
`

fs.writeFileSync('host.body.js', hostBody)
fs.writeFileSync('client.body.js', clientBody)
console.log('wrote host.body.js (%d bytes) and client.body.js (%d bytes)', hostBody.length, clientBody.length)

for (const [name, body] of [['host', hostBody], ['client', clientBody]]) {
  try {
    new Function(body)
    console.log(name + ' body: syntax OK')
  } catch (e) {
    console.error(name + ' body SYNTAX ERROR:', e.message)
    process.exit(1)
  }
}
