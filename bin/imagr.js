#!/usr/bin/env node

const imagr = require('../index.js')
const command = process.argv[2]

if (command == 'convert') {
  imagr.convert()
} else if (command == 'generate') {
  const dir = process.argv[3]
  imagr.generate({ dir })
} else {
  console.log(`\nUsage:\n  imagr convert - convert images\n`)
  // Implement
  // `\nUsage:\n\n  imagr generate <dir> - generate config file\n  imagr convert        - convert images\n`
}
