import {} from 'jest';
import models from '../../../core/models'
import * as pipelineDao from '../../../core/DAO/pipeline.dao'

describe("DAO pipeline", () => {
  beforeAll((done) => {
    models.sequelize.sync({ force: true }).then(() =>
      console.log('Initialised seqeulize in environment', process.env.NODE_ENV))
      done()
  })
  it('create', () => {
    pipelineDao.create({
      title: 'test pipeline',
      description: 'test description',
      sequence: { a: 1 }
    }).fork(
      (pipeline) => {
        Expect(pipeline.title).toBe('test pipeline')
        Expect(pipeline.description).toBe('test description')
        Expect(pipeline.sequence).toBe({ a: 1 })
      },
      (e) => {
        fail(e)
      }
    )
  })
  it('findAll', () => {
  })
})
