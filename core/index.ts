const PrettyError = require('pretty-error')
const env = process.env.NODE_ENV
// Enable sourcemap support
require('source-map-support').install()
// Pretty error
if (env === 'development' || env === 'test') {
  console.log('started Pretty Error')
  const pe = new PrettyError()
  pe.start()
}
import * as express from 'express'
import { start } from './server'

start().fork(
  (e: express.Errback) => console.error('Failed to start the server!'),
  (app: any) => {
    app.listen(app.get('port'), () => {
      console.info(('  App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'))
      console.info('  Press CTRL-C to stop\n')
    })
  }
)
