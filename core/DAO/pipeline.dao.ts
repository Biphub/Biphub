import models from '../models'
import * as fluture from 'fluture'
import { PipelineInstance, PipelineModel } from "../models/Pipeline.model"

export function create(pipeline: {
  title: string,
  description: string,
  sequence: JSON
}) {
  return fluture.Future((rej, res) => {
    console.log('before fluture ')
    models.Pipeline.create({
      title: pipeline.title,
      description: pipeline.description,
      sequence: pipeline.sequence,
    }).then(pipeline => {
      console.log('checking pipeline after creating! ', pipeline)
      res(pipeline)
    }).catch(e => rej(e))
  })
}

export function findAll() {
  return fluture.Future((rej, res) => {
    console.log('checking fluture! ')
    res(null)
  })
}
