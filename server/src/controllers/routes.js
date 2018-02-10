import {Router} from 'express'
import podController from './pod.contoller'
import pipelineController from './pipeline.controller'
import webhooksContoller from './webhooks.controller'

export default () => {
  const api = Router()
  // Pods
  api.get('/pod', podController.list)

  // Pipelines
  api.get('/pipeline', (req, res) => {
    res.json({test: 'test success'})
  })
  api.post('/pipeline', pipelineController.create)

  // Webhooks
  api.post('/webhooks*', webhooksContoller.handleWebhook)

  return api
}
