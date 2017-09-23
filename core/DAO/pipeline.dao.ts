import models from '../models'
import * as fluture from 'fluture'
import { PipelineInstance, PipelineModel } from "../models/Pipeline.model"

export function create(pipeline: {
  title: string,
  description: string,
  sequence: JSON
}) {

}

export function findAll() {
  return fluture.Future((rej, res) => {
    console.log('checking fluture! ')
    res(null)
  })
}
