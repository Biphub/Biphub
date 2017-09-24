import { Request, Response, Router } from 'express'
import { PipelineModel, PipelineInstance } from '../../models/Pipeline.model'
import { create } from '../../DAO/pipeline.dao'

export default () => {
  const api = Router()
  // Get a pipeline
  api.get('/pipeline', (req: Request, res: Response) => {
    res.json({ test: 'test success' })
  })
  // Create a pipeline
  api.post('/pipeline', (req: Request, res: Response) => {
    req.checkBody({
      title: {
        notEmpty: true
      },
      description: {
        notEmpty: true,
      },
      sequence: {
        notEmpty: true,
      }
    })
    const { title, description, sequence } = req.body
    console.log('checking title decription sequence ', title, description, sequence)
    create({ title, description, sequence })
      .fork(
        (e) => {
          console.error('failed to create a pipeline ', e)
          throw e
        },
        (pipeline: PipelineInstance) => {
          console.log('created pipe! ', pipeline)
          return res.json({
            test: 1
          }).end()
        }
      )
  })
  return api
}
