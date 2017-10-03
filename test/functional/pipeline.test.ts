import * as R from 'ramda'
import {} from 'jest'
import * as supertest from "supertest"
import * as express from 'express'
import { start } from '../../core/server'
import { default as pipelineRoutes } from '../../core/routes/pipeline'

describe("#pipeline", () => {
  it("respond with json", (done) => {
    start().fork(
      (e) => console.error(e),
      (app) => {
        const server = app.listen(app.get('port'), () => {
          const request = supertest(app)
          request
            .get('/pipeline')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              if (err) {
                throw err
              }
              console.log('checking body ', res.body.test)
              expect(res.body.test).toBe('test success')
              server.close(() => {
                console.log('closing the server!!')
                done()
              })
            })
        })
      }
    )
  })

  it('creates a pipeline', (done) => {
    start().fork(
      (e) => {
        throw e
      },
      (app) => {
        const server = app.listen(app.get('port'), () => {
          const request = supertest(app)
          request.post('/pipeline').type('form')
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
              expect(res.body.test).toBe(1)
              server.close(() => done())
            })
        })
      }
    )
  })
})
