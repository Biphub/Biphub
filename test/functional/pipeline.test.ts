import {} from 'jest'
import * as supertest from "supertest"
import * as express from 'express'
import { start } from '../../core/server'
import { default as pipelineRoutes } from '../../core/routes/pipeline'

describe("#pipeline", () => {
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999
  })
  it("respond with json", (done) => {
    const app = start()
    app.listen(app.get('port'), () => {
      const request = supertest(app)
      request
        .get('/pipeline')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err
          }
          expect(res.body.test).toBe('test success')
          done()
        })
    })
  })

  it('creates a pipeline', (done) => {
    const app = start()
    console.log('checking jasmine timeout ', jasmine.DEFAULT_TIMEOUT_INTERVAL)
    app.listen(app.get('port'), () => {
      const request = supertest(app)
      request
        .post('/pipeline')
        .type('form')
        .send({
          title: 'testing!',
          description: 'testing desc!',
          sequence: {
            a: 1
          }
        })
        .end((err, res) => {
          if (err) {
            console.error('Error while creating a new pipeline')
            return err
          }
          console.log('res!! ', res.body)
          done()
        })
    })

  })
})
