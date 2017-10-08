// Enable sourcemap support
require('source-map-support').install()
// Better logging
process.on('unhandledRejection', console.log)
import * as express from 'express'
import { start, AppContext } from './server'

start().fork(
  (e: express.Errback) => console.error('Failed to start the server!'),
  (app: any) => {
    app.listen(app.get('port'), () => {
      console.info(('  App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'))
      console.info('  Press CTRL-C to stop\n')
    })
  }
)
