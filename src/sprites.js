// Pixel-art sprite data for the DSH desk pet puppy.
// '.' = transparent. Grid: 16 cols x 14 rows.
const PALETTE = {
  O: '#3a2416', // outline
  P: '#e0a95f', // golden fur
  D: '#b97a3c', // dark fur (ears / back)
  C: '#f7e6c9', // cream (muzzle, belly, paws)
  E: '#2c1a10', // eye
  N: '#2c1a10', // nose
  T: '#f07d9c', // tongue
  M: '#a03030', // open mouth
}

// ---- IDLE: sitting, panting (2 frames) ----
const IDLE_A = [
  '................',
  '..ODD......DDO..',
  '.ODDPPPPPPPPDDO.',
  '.OPPPPPPPPPPPPO.',
  '.OPPPEEPPEEPPPO.',
  '.OPPPEPPPEPPPPO.',
  '.OPPPPPNNPPPPPO.',
  '.OPPPPCCCCPPPPO.',
  '.OPPPPCTTCCPPPO.',
  '.OPPPPCTTCPPPO..',
  '...OPPPPPPPPPO..',
  '..OPPPPPPPPPPPO.',
  '.OPPCCPPPPCCPPO.',
  '..OOOOOOOOOOOO..',
]

const IDLE_B = [
  '................',
  '..ODD......DDO..',
  '.ODDPPPPPPPPDDO.',
  '.OPPPPPPPPPPPPO.',
  '.OPPPEEPPEEPPPO.',
  '.OPPPEPPPEPPPPO.',
  '.OPPPPPNNPPPPPO.',
  '.OPPPPCCCCPPPPO.',
  '.OPPPPCTCPPPPO..',
  '...OPPPPPPPPPO..',
  '...OPPPPPPPPPO..',
  '..OPPPPPPPPPPPO.',
  '.OPPCCPPPPCCPPO.',
  '..OOOOOOOOOOOO..',
]

// ---- DIGGING: crouched, front paws alternating (4 frames) ----
const DIG_BODY = [
  '................',
  '....ODDDDDDO....',
  '...ODPPPPPPDO...',
  '..ODPPPPPPPPDO..',
  '..OPPPEEPPEEPO..',
  '..OPPPEPPPEPPO..',
  '..OPPPPPNNPPPPO.',
  '..OPPPPCCCCPPO..',
  '...OPPPPPPPPPO..',
  '...OPPPPPPPPPO..',
  '..OPPPPPPPPPPPO.',
]

const DIG_1 = [
  ...DIG_BODY,
  '.OPPPPPPPPPPPPO.',
  '..OPCCPPPPPCCPO.',
  '..OOOO......OOOO',
]

const DIG_2 = [
  ...DIG_BODY,
  '..OPCCPPPPPCCPO.',
  '..OPPPPPPPPPPPO.',
  '..OOOO......OOOO',
]

const DIG_3 = [
  ...DIG_BODY,
  '..OPCCPPPPPPPPO.',
  '..OPPPPPPPPCCPO.',
  '..OOOO......OOOO',
]

const DIG_4 = [
  ...DIG_BODY,
  '..OPPPPPPPPCCPO.',
  '..OPCCPPPPPPPPO.',
  '..OOOO......OOOO',
]

// ---- BARK: mouth open, happy (3 frames) ----
const BARK_1 = [
  '................',
  '..ODD......DDO..',
  '.ODDPPPPPPPPDDO.',
  '.OPPPPPPPPPPPPO.',
  '.OPPPEEPPEEPPPO.',
  '.OPPPEPPPEPPPPO.',
  '.OPPPPPNNPPPPPO.',
  '.OPPPPCCCCPPPPO.',
  '.OPPPPMMMPPPPO..',
  '...OPPPPPPPPPO..',
  '...OPPPPPPPPPO..',
  '..OPPPPPPPPPPPO.',
  '.OPPCCPPPPCCPPO.',
  '..OOOOOOOOOOOO..',
]

const BARK_2 = [
  '................',
  '..ODD......DDO..',
  '.ODDPPPPPPPPDDO.',
  '.OPPPPPPPPPPPPO.',
  '.OPPPEEPPEEPPPO.',
  '.OPPPEPPPEPPPPO.',
  '.OPPPPPNNPPPPPO.',
  '.OPPPPCCCCPPPPO.',
  '.OPPPPMMMPPPPO..',
  '.OPPPPTTTPPPO...',
  '...OPPPPPPPPPO..',
  '..OPPPPPPPPPPPO.',
  '.OPPCCPPPPCCPPO.',
  '..OOOOOOOOOOOO..',
]

const BARK_3 = [
  '................',
  '..ODD......DDO..',
  '.ODDPPPPPPPPDDO.',
  '.OPPPPPPPPPPPPO.',
  '.OPPPEEPPEEPPPO.',
  '.OPPPEPPPEPPPPO.',
  '.OPPPPPNNPPPPPO.',
  '.OPPPPCCCCPPPPO.',
  '.OPPPPMMMMPPPO..',
  '.OPPPPTTTPPPO...',
  '...OPPPPPPPPPO..',
  '..OPPPPPPPPPPPO.',
  '.OPPCCPPPPCCPPO.',
  '..OOOOOOOOOOOO..',
]

module.exports = { PALETTE, IDLE_A, IDLE_B, DIG_BODY, DIG_1, DIG_2, DIG_3, DIG_4, BARK_1, BARK_2, BARK_3 }
