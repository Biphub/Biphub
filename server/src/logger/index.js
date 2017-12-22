import R from 'ramda'
import chalk from 'chalk'
import fs from 'fs-extra'
import sourceMap from 'source-map'
import tracer from 'tracer'

class SourceMapManager {
  static sourceMapCache = new Map()
  static getOriginalLineFor(pathToJsFile, line, col) {
    const sourceMapFile = pathToJsFile + '.map'
    let sourceMapAsJson = SourceMapManager.sourceMapCache.get(sourceMapFile)
    if (!sourceMapAsJson) {
      try {
        sourceMapAsJson = fs.readJsonSync(sourceMapFile)
        SourceMapManager.sourceMapCache.set(sourceMapFile, sourceMapAsJson)
      } catch (err) {
        // console.error('Failed to get logging file sourcemap', err)
        return null
      }
    }

    const smc = new sourceMap.SourceMapConsumer(sourceMapAsJson)
    return smc.originalPositionFor({
      column: Number(col),
      line: Number(line)
    })
  }
}

const logger = tracer.console(
  {
    dateformat: 'HH:MM:ss',
    format: [
      '{{timestamp}} {{icon}} {{message}} (in {{method}}@{{file}}:{{line}})',
      {
        error: '{{timestamp}} {{icon}} {{message}} (in {{method}}@{{file}}:{{line}})\nCall Stack:\n{{stack}}',
        info: '{{timestamp}} {{icon}} {{message}} (in {{method}}@{{file}}:{{line}})'
      }
    ],
    preprocess: data => {
      if (data.title === 'info') {
        const {args} = data
        const head = R.propOr('', '0', args)
        if (R.test(/^init:/gi, head)) {
          data.icon = chalk.yellow('👶')
        } else if (R.test(/^mid/gi, head)) {
          data.icon = chalk.blue('👷')
        } else if (R.test(/^end/gi, head)) {
          data.icon = chalk.green('💲')
        } else {
          data.icon = chalk.blue('ℹ')
        }
      } else if (data.title === 'warn') {
        data.icon = chalk.yellow('⚠')
      } else {
        data.icon = chalk.red('✖')
      }
      const originalLoc = SourceMapManager.getOriginalLineFor(data.path, data.line, data.pos)
      if (originalLoc) {
        data.line = originalLoc.line || data.line
        data.method = originalLoc.name || data.method

        if (originalLoc.source) {
          const paths = originalLoc.source.split('/')
          const filteredPaths = paths.filter(path => {
            return path !== '..'
          })
          data.file = filteredPaths.join('/')
        }
      }
    }
  }
)

export default logger
