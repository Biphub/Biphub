import models from '../models'
import * as fluture from 'fluture'
import { PipelineModel, PipelineInstance } from '../models/Pipeline.model'
const Future = fluture.Future

/**
 * Creates a pipeline
 * @param {PipelineInstance} pipeline
 * @returns {any} // TODO Fix any type
 */
export function create (pipeline: PipelineInstance) {
  return fluture.Future((rej, res) => {
    console.log('checking models in create ', models.Pipeline)
    models.Pipeline.create(pipeline)
      .then((value: PipelineModel) => res(value))
      .catch((e: Error) => rej(e))
  })
}

export function findAll () {
  return fluture.Future((rej, res) => {
    models.Pipeline.findAll()
      .then((values) => res(values))
      .catch(e => rej(e))
  })
}

export const findPipeline = (entryApp) => Future((rej, res) => {
  console.log('finding a pipeline by name', entryApp)
  models.Pipeline.findAll({
    where: {
      entryApp: entryApp
    }
  })
    .then((pipeline) => {
      res(pipeline)
    })
    .catch(e => rej(e))
})

