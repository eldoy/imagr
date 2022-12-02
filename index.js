const { exist, tree } = require('extras')
const sharp = require('sharp')

function exit(message) {
  if (message) {
    console.log(`\n${message}`)
  }
  console.log('\nUsage: imagr <dir/name>\n')
  process.exit(0)
}

module.exports = function imagr(opt = {}) {
  const { dir } = opt
  if (!dir) {
    exit('* Error: dir name missing')
  }

  if (!exist(dir)) {
    exit('* Error: dir does not exist')
  }

  const files = tree(dir)
  console.log(files)
}
