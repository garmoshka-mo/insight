import fs from 'fs'
import {exec} from "child_process"
import {writeFileSync} from "fs"
import YmlParser from "../utils/YmlParser.js";

const ENV = process.env
const OSA_SCRIPT_ROOT = ENV.OSA_SCRIPT_ROOT

function parse(path) {
  try {
    var content = fs.readFileSync(path, 'utf8')
    return YmlParser.parse(content)
  } catch (err) {
    console.error(path)
    console.error(err.message)

    if (OSA_SCRIPT_ROOT) {
      var htmlReport = '/tmp/check_yml.html'
      writeFileSync(htmlReport, `<h3>${path}</h3>\n<pre style="font-family: Courier New">${err.message}</pre>`)
      exec(`osascript -e 'tell application "Finder" to open "${OSA_SCRIPT_ROOT}:tmp:check_yml.html"'`)
    }

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
      // console.log(JSON.stringify(data, null, 2))
      console.log('✅  Verified')
    }
  } else
    parseDir('./')
}

handleArgs()
