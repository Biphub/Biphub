import * as R from 'ramda'
// import * as uuid from 'uuid4'
import settings from '../settings'
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
 * @param initialLength
 * @returns {*}
 */
const init = (initialLength = 2) => {
  const steps = mapIndexed((x, index) => {
    // If x is not empty, simply return it back
    // TODO: Handle payload merge
    if (x) {
      return x
    }
    // 0 is always a trigger
    if (index === 0) {
      return {
        // id: uuid(),
        id: index,
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
      // id: uuid(),
      id: index,
      description: 'Initial step',
      podId: -1,
      trigger: 'invoke',
      triggerId: -1,
      nextStep: '',
    }
  }, new Array(initialLength))
  return {
    name: 'A new set of steps',
    description: 'Change the description',
    editing: [0, 0],
    selectedPod: undefined, // Currently selected pod
    selectedPodActions: [], // Currently displaying actions
    steps,
  }
}

/**
 * Get step name by type and name
 * If type is 0 it will always return STEP_EVENT
 * @param typeIndex <Number>
 * @param nameIndex <Number>
 */
const getStepName = (typeIndex, nameIndex) => {
  if (typeIndex === 0) {
    return settings.STEP_EVENT[nameIndex].name
  }
  return settings.STEP_ACTION[nameIndex].name
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
 * @param path
 * @param value
 * @param stepScript
 */
const setStepValue = (stepIndex, path, value, stepScript) => {
  const getPath = () => {
    const initialPath = ['steps', stepIndex]
    if (R.type(path) !== 'Array') {
      return R.append(path, initialPath)
    } else if (R.type(path) === 'Array') {
      // Merging array path
      return R.merge(path, initialPath)
    }
  }
  const stepLens = R.lensPath(getPath())
  return R.set(stepLens, value, stepScript)
}

/**
 * Setting selected pod
 * @param pod
 * @param stepScript
 */
const setSelectedPod = (pod, stepScript) => {
  if (R.type(pod) !== 'Object') {
    throw Error('Invalid pod object ', pod)
  }
  const podLens = R.lensProp('selectedPod')
  return R.set(podLens, pod, stepScript)
}

/**
 * Actions of selected pod
 * @param podActions
 * @param stepScript
 */
const setSelectedPodActions = (podActions, stepScript) => {
  if (R.type(podActions) !== 'Array') {
    throw Error('Invalid actions object ', podActions)
  }
  const lens = R.lensProp('selectedPodActions')
  return R.set(lens, podActions, stepScript)
}

/**
 * Action selected from list of pod actions
 * @param action
 * @param stepScript
 */
const setSelectedAction = (action, stepScript) => {
  if (R.type(action) !== 'Object') {
    throw Error('Invalid action object ', action)
  }
  const lens = R.lensProp('selectedAction')
  return R.set(lens, action, stepScript)
}

/**
 * Setting selected action options
 * @param options
 * @param stepScript
 */
const setSelectedActionOptions = (options, stepScript) => {
  if (R.type(options) !== 'Object') {
    throw Error('Invalid options object ', options)
  }
  const lens = R.lensProp('selectedActionOptions')
  return R.set(lens, options, stepScript)
}

/**
 * Example
 *

 {
	"title": "test pipeline",
	"description": "this is just for testing!",
	"entryApp": "biphub-pod-fake1",
	"entryType": "webhook",
	"nodes": [
	  {
	    "id": 1,
	    "podName": "biphub-pod-fake1",
	    "actionName": "webhook"
	  },
	  {
	    "id": 2,
	    "podName": "biphub-pod-fake1",
	    "actionName": "post-fake-message"
	  },
	  {
	    "id": 3,
	    "podName": "biphub-pod-fake2",
	    "actionName": "create-fake-issue"
	  },
	  {
	    "id": 4,
	    "podName": "biphub-pod-fake2",
	    "actionName": "test-move-issue"
	  },
	  {
	    "id": 5,
	    "podName": "biphub-pod-fake1",
	    "actionName": "search-channel"
	  },
	  {
	    "id": 6,
	    "podName": "biphub-pod-fake1",
	    "actionName": "deleteFakeMessage"
	  }
	],
	"edges": [
	  {"from": 1, "to": 2},
	  {"from": 2, "to": 3},
	  {"from": 3, "to": 4},
	  {"from": 4, "to": 5},
	  {"from": 5, "to": 6}
	]
}
 * @param stepScript
 */
const convertToPipelineData = stepScript => {
  return R.compose(
    pipeline =>
      R.map(
        x => ({
          id: x.id, // uuid generated by frontend
          podId: x.podId,
          triggerId: x.triggerId,
        }),
        stepScript.steps,
      ),
    pipeline => {
      const pipelineMeta = {
        title: stepScript.title,
        description: stepScript.description,
        // entryApp: ??   do we need it?
        // entryType: ??  do we need it?
      }
      R.merge(pipeline, pipelineMeta)
    },
  )({}) // Starts with a blank object
}

export default {
  init,
  getStepName,
  setNextStep,
  setStepValue,
  setSelectedPod,
  setSelectedPodActions,
  setSelectedAction,
  setSelectedActionOptions,
  convertToPipelineData,
}
