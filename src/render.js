// Minimal pure-Node PNG renderer for sprite verification.
// Renders each sprite scaled up, on a checkerboard so transparency is visible.
const fs = require('fs')
const zlib = require('zlib')
const { PALETTE, IDLE_A, IDLE_B, DIG_1, DIG_2, DIG_3, DIG_4, BARK_1, BARK_2, BARK_3 } = require('./sprites')

// ---- PNG encoder ----
const CRC_TABLE = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0 // filter none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  const idat = zlib.deflateSync(raw, { level: 9 })
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))])
}

// ---- hex -> rgba ----
function hexToRgba(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 255]
}

// ---- render one sprite map ----
function renderSprite(map, scale, checker) {
  const w = map[0].length
  const h = map.length
  const W = w * scale
  const H = h * scale
  const rgba = Buffer.alloc(W * H * 4)
  const cbA = hexToRgba('#d8d3cc')
  const cbB = hexToRgba('#efece6')
  for (let py = 0; py < h; py++) {
    const row = map[py]
    for (let px = 0; px < w; px++) {
      const ch = row[px]
      let col = null
      if (ch !== '.') col = hexToRgba(PALETTE[ch] || '#ff00ff')
      for (let dy = 0; dy < scale; dy++) {
        for (let dx = 0; dx < scale; dx++) {
          const X = px * scale + dx
          const Y = py * scale + dy
          const i = (Y * W + X) * 4
          if (!col) {
            const cell = ((X >> 3) + (Y >> 3)) & 1
            const c = cell ? cbA : cbB
            rgba[i] = c[0]; rgba[i + 1] = c[1]; rgba[i + 2] = c[2]; rgba[i + 3] = 255
          } else {
            rgba[i] = col[0]; rgba[i + 1] = col[1]; rgba[i + 2] = col[2]; rgba[i + 3] = col[3]
          }
        }
      }
    }
  }
  return encodePNG(W, H, rgba)
}

// ---- sheet: one sprite per row of sprites, laid horizontally ----
function renderSheet(entries, scale) {
  const w = 16 * scale
  const h = 14 * scale
  const gap = 4 * scale
  const W = entries.length * w + (entries.length - 1) * gap
  const H = h
  const rgba = Buffer.alloc(W * H * 4)
  const cbA = hexToRgba('#d8d3cc')
  const cbB = hexToRgba('#efece6')
  for (let Y = 0; Y < H; Y++) {
    for (let X = 0; X < W; X++) {
      const cell = ((X >> 3) + (Y >> 3)) & 1
      const c = cell ? cbA : cbB
      const i = (Y * W + X) * 4
      rgba[i] = c[0]; rgba[i + 1] = c[1]; rgba[i + 2] = c[2]; rgba[i + 3] = 255
    }
  }
  entries.forEach((map, idx) => {
    const off = idx * (w + gap)
    for (let py = 0; py < 14; py++) {
      const row = map[py]
      for (let px = 0; px < 16; px++) {
        const ch = row[px]
        if (ch === '.') continue
        const col = hexToRgba(PALETTE[ch] || '#ff00ff')
        for (let dy = 0; dy < scale; dy++) {
          for (let dx = 0; dx < scale; dx++) {
            const X = off + px * scale + dx
            const Y = py * scale + dy
            const i = (Y * W + X) * 4
            rgba[i] = col[0]; rgba[i + 1] = col[1]; rgba[i + 2] = col[2]; rgba[i + 3] = col[3]
          }
        }
      }
    }
  })
  return encodePNG(W, H, rgba)
}

const scale = 10
const out = './out'
fs.mkdirSync(out, { recursive: true })

const sheets = {
  'idle.png': [IDLE_A, IDLE_B],
  'digging.png': [DIG_1, DIG_2, DIG_3, DIG_4],
  'bark.png': [BARK_1, BARK_2, BARK_3],
}

for (const [name, frames] of Object.entries(sheets)) {
  fs.writeFileSync(`${out}/${name}`, renderSheet(frames, scale))
  console.log(`wrote ${out}/${name}`)
}

// sanity: check all maps are 16x14 and only use known keys
const all = [IDLE_A, IDLE_B, DIG_1, DIG_2, DIG_3, DIG_4, BARK_1, BARK_2, BARK_3]
for (const m of all) {
  if (m.length !== 14) throw new Error(`bad height ${m.length}`)
  for (const r of m) {
    if (r.length !== 16) throw new Error(`bad width ${r.length}: ${r}`)
    for (const ch of r) {
      if (ch !== '.' && !PALETTE[ch]) throw new Error(`unknown key ${ch}`)
    }
  }
}
console.log('all sprites valid: 16x14, known keys only')
