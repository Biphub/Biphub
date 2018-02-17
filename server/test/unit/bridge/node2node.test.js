import {} from 'jest'
import R from 'ramda'
import { getAllManifests } from '../../../dist/bridge/node2node'

describe('Node2Node bridge', () => {
  it('must return any json', () => {
    const result = getAllManifests()
    expect(result).not.toBe(null)
    expect(result).not.toBe([])
  })
  it('each manifest must contain name, title, desc, url', () => {
    const results = getAllManifests()
    R.forEach(man => {
      expect(man.title).toBeDefined()
      expect(man.name).toBeDefined()
      expect(man.description).toBeDefined()
      expect(man.url).toBeDefined()
    }, results)
  })
})
