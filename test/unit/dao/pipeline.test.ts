import {} from 'jest';
import { default as models } from '../../../dist/models'

describe("DAO pipeline", () => {
  beforeAll((done) => {
    models.sequelize.sync().then(() =>
      console.log('Initialised seqeulize in environment', process.env.NODE_ENV))
      done()
  })
  it("create", () => {
    models.Pipeline.create({
      title: 'test pipeline',
      description: 'test description',
      sequence: { a: 1 }
    }).then((pipeline) => {
      Expect(pipeline.title).toBe('test pipeline')
      Expect(pipeline.description).toBe('test description')
      Expect(pipeline.sequence).toBe({ a: 1 })
    })
  });
});
