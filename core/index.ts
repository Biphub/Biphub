import * as express from 'express'
import { start } from './server'

start().fork(
  (e: express.Errback) => console.error('Failed to start the server!'),
  (app: express.Application) => {
    app.listen(app.get('port'), () => {
      console.log(('  App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'))
      console.log('  Press CTRL-C to stop\n')
      app.queue.push({ name: 'hey from app' }, () => {
        console.log('lol')
      })
    })
  }
)
