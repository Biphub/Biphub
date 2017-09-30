import * as R from 'ramda'
import {} from 'jest';
import models from '../../../core/models'
import * as podDao from '../../../core/DAO/pod.dao'

describe("#PodDao test", () => {
  beforeEach((done) => {
    models.sequelize.sync({ force: true }).then(() => {
      console.log('Initialised seqeulize in environment', process.env.NODE_ENV)
      done()
    })
  })
  it('install all pods', () => {
    podDao.installPods()
      .fork(
        (err) => console.error(err),
        (pods) => {
          expect(R.isEmpty(pods)).toBe(false)
        }
      )
  })
  it('each pod should contain title, desc, name, id, url, updatedAt, createdAt', () => {
    podDao.installPods()
      .fork(
        (err) => console.error(err),
        (pods) => {
          const plainPods = R.map((pod) => pod.values, pods)
          R.forEach((pod) => {
            expect(R.isEmpty(pod.title)).toBe(false)
            expect(R.isEmpty(pod.id)).toBe(false)
            expect(R.isEmpty(pod.description)).toBe(false)
            expect(R.isEmpty(pod.url)).toBe(false)
            expect(R.isEmpty(pod.updatedAt)).toBe(false)
            expect(R.isEmpty(pod.createdAt)).toBe(false)
          }, plainPods)
        }
      )
  })
})
