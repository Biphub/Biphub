import {Router} from 'express'
import pipelineController from '../controllers/pipeline.controller'
import webhooksContoller from '../controllers/webhooks.controller'

export default () => {
  const api = Router()
  // Pipeline routes -> /pipeline
  api.get('/pipeline', (req, res) => {
    res.json({test: 'test success'})
  })
  api.post('/pipeline', pipelineController.create)

  // Webhooks
  api.post('/webhooks*', webhooksContoller.postWebhooks)

  return api
}
