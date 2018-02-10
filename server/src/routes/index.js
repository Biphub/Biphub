import {Router} from 'express'
import pipelineController from '../controllers/pipeline.controller'
import webhooksContoller from '../controllers/webhooks.controller'

export default () => {
  const api = Router()
  // Pipeline routes -> /pipeline
  api.get('/pipeline', (req, res) => {
    res.json({test: 'test success'})
  })
  // TODO: We may not need this
  api.post('/pipeline', pipelineController)

  // Webhooks
  api.post('/webhooks*', webhooksContoller.postWebhooks)

  return api
}
