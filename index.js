const path = require('path')
const extras = require('extras')
const sharp = require('sharp')

const TYPES = ['bmp', 'gif', 'jpg', 'jpeg', 'png']

function exit(message, usage) {
  if (message) {
    console.info(`\n${message}`)
  }
  if (usage) {
    console.info('\nUsage: imagr <dir/name>\n')
  }
  process.exit(1)
}

// Example config file object
// - name: some_file_name
//   source: app/assets/img/original_file_name.jpg
//   to: app/assets/img/file_name.webp
//   versions:
//     - large: 600x1200
//     - medium: 400x800
//     - thumb: 200x300

let config = {}

try {
  config = extras.read('app/config/imagr.yml')
} catch (e) {}

try {
  config = extras.read('imagr.yml')
} catch (e) {
  console.info(e.message)
}

console.info(JSON.stringify(config, null, 2))

module.exports = function imagr(opt = {}) {
  const { dir } = opt
  if (!dir) {
    exit('* Error: dir name missing', true)
  }

  if (!extras.exist(dir)) {
    exit('* Error: dir does not exist', true)
  }

  const files = config.files || []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const { src, to } = file

    // FEATURE: Could possible not have to field and default to same file name and 'webp'
    // Check if required fields exist
    const fields = []
    if (!src) fields.push('src')
    if (!to) fields.push('to')
    if (fields.length) {
      const text = file.name || `number ${i + 1}`
      console.info(
        `File ${text} is missing ${fields.join(' and ')}, skipping...`
      )
      continue
    }

    // Check if file exists
    if (!extras.exist(file.src)) {
      console.info(`${file.src} does not exist, skipping...`)
      continue
    }

    const name = file.name || file.src

    // Check if it's the correct type
    const [basesrc, extsrc] = extras.basext(file.src)
    console.info({ basesrc, extsrc })
    if (!TYPES.includes(extsrc)) {
      console.info(`${name}: type ${extsrc} not supported, skipping...`)
      continue
    }

    // OPTIMIZE: Candidate for extras.pathname(file) function
    // Create dir if it doesn't exist
    const pathname = file.src.split(path.sep).slice(0, -1).join(path.sep)
    console.log(pathname)
    if (!extras.exist(pathname)) {
      console.log(`Creating directory ${pathname}`)
      extras.mkdir(pathname)
    }

    // const basename = path.basename(file.source)

    // console.log({ basename })

    // const [baseTo, extTo] = extras.basext(file.to)

    // if (!TYPES.includes(ext)) continue
  }
}

// Can use this for generating config file:
// const files = extras.tree(dir)
// console.info(files)

// for (const file of files) {
//   const [base, ext] = extras.basext(file)
//   console.info(base, ext)

//   if (!TYPES.includes(ext)) continue
// }
