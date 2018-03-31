import * as R from 'ramda'
import StepScriptUtil from './StepScript'


test('init stepscript', () => {
  const result = StepScriptUtil.init(2)
  expect(result.name).toBe('A new set of steps')
  expect(result.description).toBe('Change the description')
  expect(R.equals(result.editing, [0, 0])).toBeTruthy()
  expect(result.selectedPod).toBe(undefined)
  expect(R.equals(result.selectedActions, [])).toBeTruthy()
})