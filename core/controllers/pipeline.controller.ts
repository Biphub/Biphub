import { Request, Response } from 'express'
import { PipelineInstance } from '../models/Pipeline.model'
import * as pipelineDao from '../DAO/pipeline.dao'

export const create = (req: Request, res: Response) => {
  req.checkBody({
    title: {
      notEmpty: true
    },
    description: {
      notEmpty: true
    },
    sequence: {
      notEmpty: true
    }
  })
  const { title, description, sequence } = req.body
  pipelineDao.create({ title, description, sequence })
    .fork(
      (e) => {
        console.error('failed to create a pipeline ', e)
        throw e
      },
      (pipeline: PipelineInstance) => {
        return res.json({
          test: 1
        })
      }
    )
}
