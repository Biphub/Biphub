import 'babel-polyfill'
import { start } from './server'
const PrettyError = require('pretty-error')

require('source-map-support').install()

const env = process.env.NODE_ENV
// Pretty error
if (env === 'development' || env === 'test') {
  console.log('started Pretty Error')
  const pe = new PrettyError()
  pe.start()
}

start().fork(
  e => console.error('Failed to start the server! ', e),
  app => {
    app.listen(app.get('port'), () => {
      console.info(
        '  App is running at http://localhost:%d in %s mode',
        app.get('port'),
        app.get('env'),
      )
      console.info('  Press CTRL-C to stop\n')
    })
  },
)
