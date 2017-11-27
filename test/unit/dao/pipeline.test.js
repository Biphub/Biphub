import {} from 'jest';
import models from '../../../core/models'
import pipelineDao from '../../../core/DAO/pipeline.dao'

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
        expect(pipeline.title).toBe('test pipeline')
        expect(pipeline.description).toBe('test description')
        expect(pipeline.sequence).toBe({ a: 1 })
      },
      (e) => {
        fail(e)
      }
    )
  })
})
