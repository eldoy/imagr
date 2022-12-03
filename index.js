const path = require('path')
const extras = require('extras')
const sharp = require('sharp')
const readexif = require('exif-reader')

const TYPES = ['bmp', 'gif', 'jpg', 'jpeg', 'png']
const FORMATS = ['webp']

function exit(message, usage) {
  if (message) {
    console.log(`\n${message}`)
  }
  if (usage) {
    console.log('\nUsage: imagr <dir/name>\n')
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
  config = extras.read('imagr.yml')
} catch (e) {
  console.log(e.message)
}

try {
  config = extras.read('app/config/imagr.yml')
} catch (e) {
  console.log(e.message)
}

async function convert(opt = {}) {
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
      console.log(
        `File ${text} is missing ${fields.join(' and ')}, skipping...`
      )
      continue
    }

    // Check if file exists
    if (!extras.exist(file.src)) {
      console.log(`${file.src} does not exist, skipping...`)
      continue
    }

    // Check if src is the correct type
    const [basesrc, extsrc] = extras.basext(file.src)
    if (!TYPES.includes(extsrc)) {
      console.log(`${file.src}: type ${extsrc} not supported, skipping...`)
      continue
    }

    // Check if to is the correct type
    const [baseto, extto] = extras.basext(file.to)
    if (!FORMATS.includes(extto)) {
      console.log(`${file.to}: type ${extto} not supported, skipping...`)
      continue
    }

    // OPTIMIZE: Candidate for extras.pathname(file) function
    // Create dir if it doesn't exist
    const topath = file.to.split(path.sep).slice(0, -1).join(path.sep)
    if (!extras.exist(topath)) {
      console.log(`Creating directory ${topath}`)
      extras.mkdir(topath)
    }

    // Convert file
    const srcpath = extras.resolve(file.src)
    console.log(`Converting ${file.src} to ${file.to}`)
    try {
      await sharp(file.src).toFile(file.to)
    } catch (e) {
      console.error(e.message)
    }

    // Create versions
    const versions = file.versions || []
    for (let j = 0; j < versions.length; j++) {
      const version = versions[j]
      const { name, size } = version
      const data = []
      if (!name) data.push('name')
      if (!size) data.push('size')
      if (data.length) {
        console.log(`Version is missing ${data.join(' and ')}`)
        continue
      }

      // Build version name
      const versionname = `${topath}${path.sep}${baseto}-${name}@${size}.${extto}`
      console.log(`Creating ${versionname}`)

      // Find dimensions
      const dimensions = size.split('x').map((x) => parseInt(x.trim()))

      try {
        await sharp(file.src)
          .resize(...dimensions)
          .toFile(versionname)
      } catch (e) {
        console.error(e.message)
      }
    }

    // READ METADATA:
    // const info = await sharp(srcpath).metadata()
    // const exif = readexif(info.exif)
    // console.log(exif)
    // await extras.sleep(2)
  }
}

// TODO: Implement
function generate(opt = {}) {
  console.log('Not implemented!')
  return

  // const { dir } = opt
  // if (!dir) {
  //   exit('* Error: dir name missing', true)
  // }

  // if (!extras.exist(dir)) {
  //   exit('* Error: dir does not exist', true)
  // }

  // FEATURE:
  // Can use this for generating config file:
  // const files = extras.tree(dir)
  // console.log(files)

  // for (const file of files) {
  //   const [base, ext] = extras.basext(file)
  //   console.log(base, ext)

  //   if (!TYPES.includes(ext)) continue
  // }
}

module.exports = { convert, generate }
