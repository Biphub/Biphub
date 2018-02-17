import {} from 'jest'
import supertest from 'supertest'
import { start } from '../../core/server'

const request = supertest('http://localhost:3000')
describe('POST /webhooks*', () => {
  beforeAll(done => {
    start().fork(
      e => console.error(e),
      app => {
        app.listen(app.get('port'), () => {
          done()
        })
      }
    )
  })
  it('should return 200 OK', done => {
    request.post('/webhooks/test').expect(200, done)
  })
  it('should return root webhooks', done => {
    request
      .post('/webhooks/test')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return err
        }
        console.log('checking! ', res.body.root)
        expect(res.body.root).toBe('webhooks')
      })
  })
})
