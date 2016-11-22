
const readline = require('readline')
const ProgressPlugin = require('webpack').ProgressPlugin
const frame = require('elegant-spinner')()
const throttle = require('lodash.throttle')
const chalk = require('chalk')
const clearConsole = require('react-dev-utils/clearConsole')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')

function WebpackLoggerPlugin (opts = {}) {
  this.stream = opts.stream || process.stdout
}

WebpackLoggerPlugin.prototype.apply = function (compiler) {
  const stream = this.stream

  if (!stream || !stream.isTTY) {
    return
  }

  let spinnerOn
  setTimeout(() => {
    clearConsole()
    spinnerOn = true
    stream.write('\n')
  }, 1000)

  const getProgressMsg = (percent, msg) => {
    switch (true) {
      case msg === 'compile':
        return chalk.cyan(frame() + ' Scanning')

      case msg.indexOf('build') >= 0:
        let [complete, toGo] = msg.split(' ')[0].split('/')
        return chalk.cyan(`${frame()} Building Modules [${complete} of ${toGo}]`)

      case msg.indexOf('chunk asset') >= 0:
        return chalk.yellow(frame() + ' Optimizing')

      case msg === 'asset optimization':
        return chalk.yellow(frame() + ' Packing up assets')

      case msg.indexOf('emit') >= 0:
        return chalk.yellow(frame() + ' Writing to disc')

      default:
        return `${frame()} ${msg}`
    }
  }

  const onProgress = (percent, msg) => {
    if (!spinnerOn) return
    readline.clearLine(stream, 0)
    readline.cursorTo(stream, 0, null)
    stream.write(getProgressMsg(percent, msg))
  }

  const progress = new ProgressPlugin(throttle(onProgress, 150))
  progress.apply(compiler)

  compiler.plugin('invalid', () => {
    clearConsole()
    console.log()
    console.log(chalk.dim('Recompiling...'))
    console.log()
  })

  compiler.plugin('done', (stats) => {
    clearConsole()

    let messages = formatWebpackMessages(stats.toJson({}, true))

    console.log()

    if (!messages.errors.length && !messages.warnings.length) {
      console.log(
        '✨' +
        chalk.green('  Build Complete!') +
        chalk.dim(' Waiting for changes...')
      )
    }

    // If errors exist, only show errors.
    if (messages.errors.length) {
      console.log('🚨' + chalk.red('  Failed to compile.'))
      console.log()
      messages.errors.forEach(message => {
        console.log(message)
        console.log()
      })
      return
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.'))
      console.log()
      messages.warnings.forEach(message => {
        console.log(message)
        console.log()
      })
    }
  })
}

module.exports = WebpackLoggerPlugin
