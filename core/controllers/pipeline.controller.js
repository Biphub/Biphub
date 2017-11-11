import {logger} from '../logger'
import * as pipelineDao from '../DAO/pipeline.dao'

export const create = (req, res) => {
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
  const {title, description, sequence} = req.body
  pipelineDao.create({title, description, sequence})
    .fork(
      e => {
        console.error('failed to create a pipeline ', e)
        throw e
      },
      pipeline => {
        return res.json({
          test: 1
        })
      }
    )
}
