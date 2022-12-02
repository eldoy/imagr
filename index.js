const { exist, tree } = require('extras')
const sharp = require('sharp')

const dir = process.argv[2]

function exit(message) {
  if (message) {
    console.log(`\n${message}`)
  }
  console.log('\nUsage: imagr <dir/name>\n')
  process.exit(0)
}

if (!dir) {
  exit('* Error: dir name missing')
}

if (!exist(dir)) {
  exit('* Error: dir does not exist')
}

const files = tree(dir)

console.log(files)
