import yaml from 'js-yaml'
import fs from 'fs'

function parse(path) {
  try {
    var content = fs.readFileSync(path, 'utf8')
    content = content.replace(/\t/g, '    ')
    return yaml.load(content)
  } catch (err) {
    console.error(path)
    console.error(err.message)
    throw('⛔️  yml error found')
  }
}

function parseDir(path) {
  var files = 0, checked = 0
  fs.readdirSync(path).forEach(file => {
    if (file.endsWith('.yml')) {
      parse(path + '/' + file)
      checked++
    }
    files ++
  })
  console.log(`✅  Verified ${checked} yml from ${files} files`)
}

function handleArgs() {
  var args = process.argv.slice(2)

  if (args[0]) {
    if (fs.lstatSync(args[0]).isDirectory())
      parseDir(args[0])
    else {
      var data = parse(args[0])
      console.log(JSON.stringify(data, null, 2))
      console.log('✅  Verified')
    }
  } else
    parseDir('./')
}

handleArgs()
