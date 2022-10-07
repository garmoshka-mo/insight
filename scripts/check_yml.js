import fs from 'fs'
import {exec} from "child_process"
import {writeFileSync} from "fs"
import YmlParser from "../utils/YmlParser.js";
import diff from 'diff-lines'

const ENV = process.env
const OSA_SCRIPT_ROOT = ENV.OSA_SCRIPT_ROOT

function parse(path) {
  try {
    var content = fs.readFileSync(path, 'utf8')
    var parser = new YmlParser(content)
    parser.parse()
    return parser
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
  var args = process.argv.slice(2), path

  if ((path = args[0])) {
    if (!fs.existsSync(path)) throw `Path doesn't exists: ${path}`
    if (fs.lstatSync(path).isDirectory())
      parseDir(path)
    else {
      var parser = parse(path)
      if (args[1] == 'print')
        console.log(JSON.stringify(parser.result, null, 2))
      // if (args[1] == 'diff')
      console.log('💊 DIFF\n',
        diff(parser.initial_yaml, parser.result_yaml,
          {n_surrounding: 1})
      )

      console.log('✅  Verified')
    }
  } else
    parseDir('./')
}

handleArgs()
