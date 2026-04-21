const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const src = path.join(__dirname, '../public/icon-512.png')
const outDir = path.join(__dirname, '../public/icons')
const sizes = [48, 72, 96, 128, 144, 152, 192, 256, 384, 512]

fs.mkdirSync(outDir, { recursive: true })

Promise.all(
  sizes.map(size =>
    sharp(src)
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toFile(path.join(outDir, `icon-${size}.png`))
      .then(() => console.log(`✓ icon-${size}.png`))
  )
).then(() => console.log('\nAll icons generated in public/icons/'))
  .catch(err => { console.error(err); process.exit(1) })
