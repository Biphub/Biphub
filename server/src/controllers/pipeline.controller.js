import logger from '../logger'
import * as pipelineDao from '../DAO/pipeline.dao'

const list = (req, res) => {
  pipelineDao.listAll().fork(
    error => {
      logger.error('Failed to list all pipelines', error)
      throw error
    },
    result => {
      return res.json({
        ok: true,
        data: result
      })
    }
  )
}

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
    },
    dataMaps: {
      notEmpty: true
    }
  })
  const {title, entryApp, entryType, description, nodes, edges, dataMaps} = req.body
  pipelineDao.create({
    title,
    entryApp,
    entryType,
    description,
    nodes,
    edges,
    dataMaps,
  })
    .fork(
      error => {
        logger.error('failed to create a pipeline ', error)
        throw error
      },
      result => {
        logger.info('Saved a pipeline!')
        return res.json({
          result: `Successfully created a pipeline ! ${result.get('id')}`
        })
      }
    )
}

export default {
  create,
  list
}
