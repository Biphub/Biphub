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
    models.Pipeline.create(pipeline)
      .then((value: PipelineModel) => res(value))
      .catch((e: Error) => rej(e))
  })
}

/**
 * Find all pipelines by entry app name.
 * @param {string} entryApp
 */
export const findAllPipelines = (entryApp: string) => Future((rej, res) => {
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
