import models from '../models'
import * as fluture from 'fluture'
import { PipelineModel } from "../models/Pipeline.model"

export function create(pipeline: {
  title: string,
  description: string,
  sequence: JSON
}) {
  return fluture.Future((rej, res) => {
    console.log('before fluture ')
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
