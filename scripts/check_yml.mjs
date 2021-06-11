import yaml from 'js-yaml'
import fs from 'fs'

function parse(path) {
  try {
    var content = fs.readFileSync(path, 'utf8')
    content = content.replace(/\t/g, '    ')
    return yaml.load(content)
  } catch (err) {
    console.error(path, err.message)
    throw('yml error found')
  }
}

function parseDir(path) {
  fs.readdirSync(path).forEach(file => {
    if (file.endsWith('.yml')) parse(file)
  })
}

function handleArgs() {
  var args = process.argv.slice(2)

  if (args[0]) {
    if (fs.lstatSync(args[0]).isDirectory())
      parseDir(args[0])
    else
      parse(args[0])
  } else
    parseDir('./')
}

handleArgs()
