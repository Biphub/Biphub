import logger from '../logger'
import * as pipelineDao from '../DAO/pipeline.dao'

// Quick commit test
const create = (req, res) => {
  req.checkBody({
    title: {
      notEmpty: true
    },
    entryApp: {
      notEmpty: true
    },
    entryType: {
      notEmpty: true
    },
    description: {
      notEmpty: true
    },
    nodes: {
      notEmpty: true
    },
    edges: {
      notEmpty: true
    }
  })
  const {title, entryApp, entryType, description, nodes, edges} = req.body
  pipelineDao.create({ title, entryApp, entryType, description, nodes, edges })
    .fork(
      (error) => {
        logger.error('failed to create a pipeline ', error)
        throw error
      },
      (result) => {
        logger.info('Saved a pipeline!')
        return res.json({
          result: `Successfully created a pipeline ! ${result.get('id')}`
        })
      }
    )
}

export default {
  create,
}