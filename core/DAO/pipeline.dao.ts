import models from '../models'
import * as fluture from 'fluture'
import { PipelineModel, PipelineInstance } from "../models/Pipeline.model"

export function create(pipeline: PipelineInstance) {
  return fluture.Future((rej, res) => {
    models.Pipeline.create(pipeline)
      .then((value: PipelineModel) => res(value))
      .catch((e: Error) => rej(e))
  })
}

function findAll() {
  return fluture.Future((rej, res) => {
    models.Pipeline.findAll()
      .then((values) => res(values))
      .catch(e => rej(e))
  })
}

export {
  findAll
}
