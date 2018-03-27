import * as R from 'ramda'
import uuid from 'uuid4'
import settings from './settings'
const mapIndexed = R.addIndex(R.map)

/**
 * What is stepscript?
 *
 * Script used by pipeline steps (frontend)
 * {
 *   name: name of the step
 *   description: Description of the pipeline
 *   editing: step that is currently being edited
 *   steps: [
 *     // step object
 *     {
 *        id: unique identification
 *        description: description of this step
 *        nextStep: indicate next step
 *     }
 *   ]
 * }
 */

/**
 * Initialise stepscript according to given number of steps
 * @param number
 * @returns {*}
 */
const init = (number = 2) => {
  const steps = mapIndexed((x, index) => {
    // If x is not empty, simply return it back
    // TODO: Handle payload merge
    if (x) {
      return x
    }
    // 0 is always a trigger
    if (index === 0) {
      return {
        id: uuid(),
        description: 'Initial step',
        podId: -1,
        trigger: 'event', // This may change
        triggerId: -1,
        options: {},
        // lastEditingStep: 0,
        nextStep: '', // going to next index by default
      }
    }
    return {
      id: uuid(),
      description: 'Initial step',
      podId: -1,
      trigger: 'invoke',
      triggerId: -1,
      nextStep: '',
    }
  }, new Array(number))
  return {
    name: 'A new set of steps',
    description: 'Change the description',
    editing: [0, 0],
    steps,
  }
}

/**
 * Get step name by x, y
 * @param x
 * @param y
 */
const getStepName = (x, y) => {
  if (x === 0) {
    return settings.STEP_EVENT[y].name
  }
  return settings.STEP_ACTION[y].name
}

/**
 * Edits editing property of stepscript
 * @param groupIndex
 * @param stepIndex
 * @param stepScript
 */
const setNextStep = (groupIndex, stepIndex, stepScript) => {
  const editingPath = R.lensProp('editing')
  return R.set(editingPath, [groupIndex, stepIndex + 1], stepScript)
}

/**
 * Set group value by key
 * @param stepIndex
 * @param key
 * @param value
 * @param stepScript
 */
const setStepValue = (stepIndex, key, value, stepScript) => {
  console.log(
    'gindex ',
    stepIndex,
    ' key ',
    key,
    ' value ',
    value,
    ' script ',
    stepScript,
  )
  const stepLens = R.lensPath(['steps', stepIndex, key])
  return R.set(stepLens, value, stepScript)
}

export default {
  init,
  getStepName,
  setNextStep,
  setStepValue,
}
