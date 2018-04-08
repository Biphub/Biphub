import StepScriptUtil from './StepScript'

test('init stepscript', () => {
  const result = StepScriptUtil.init(2)
  const expected = {
    name: 'A new set of steps',
    description: 'Change the description',
    editing: [0, 0],
    selectedPod: undefined,
    selectedActions: [],
    steps: [
      {
        id: 0,
        description: 'Initial step',
        podId: -1,
        trigger: 'event', // This may change
        triggerId: -1,
        options: {},
        nextStep: '', // going to next index by default
      },
      {
        id: 1,
        description: 'Initial step',
        podId: -1,
        trigger: 'invoke',
        triggerId: -1,
        nextStep: '',
      },
    ],
  }
  expect(result).toEqual(expected)
})

test('get step names', () => {
  const CHOOSE_POD = 'choosePod'
  const CHOOSE_EVENT = 'chooseEvent'
  const AUTHENTICATION = 'authentication'
  const SETUP_OPTIONS = 'setupOptions'
  const TEST_SETUP = 'testSetup'
  const CHOOSE_ACTIONS = 'chooseAction'
  const SETUP_TEMPLATES = 'setupTemplates'
  const expected = {
    STEP_EVENT: [
      CHOOSE_POD,
      CHOOSE_EVENT,
      AUTHENTICATION,
      SETUP_OPTIONS,
      TEST_SETUP,
    ],
    STEP_ACTION: [
      CHOOSE_POD,
      CHOOSE_ACTIONS,
      AUTHENTICATION,
      SETUP_TEMPLATES,
      TEST_SETUP,
    ],
  }
  const result = {
    STEP_EVENT: [
      StepScriptUtil.getStepName(0, 0),
      StepScriptUtil.getStepName(0, 1),
      StepScriptUtil.getStepName(0, 2),
      StepScriptUtil.getStepName(0, 3),
      StepScriptUtil.getStepName(0, 4),
    ],
    STEP_ACTION: [
      StepScriptUtil.getStepName(1, 0),
      StepScriptUtil.getStepName(1, 1),
      StepScriptUtil.getStepName(1, 2),
      StepScriptUtil.getStepName(1, 3),
      StepScriptUtil.getStepName(1, 4),
    ],
  }
  expect(result).toEqual(expected)
})

test('set next step: from editing 0, 0 to 0, 1', () => {
  const expected = {
    editing: [0, 1],
  }
  const result = StepScriptUtil.setNextStep(0, 0, {})
  expect(result).toEqual(expected)
})

test('set step value: setting a random value', () => {
  const stepScript = {
    steps: [
      {
        test: 0,
      },
    ],
  }
  const expected = {
    steps: [
      {
        test: 123,
      },
    ],
  }
  const result = StepScriptUtil.setStepValue(0, 'test', 123, stepScript)
  expect(result).toEqual(expected)
})

test('set selected pod id 1', () => {
  const stepScript = {
    selectedPod: {
      id: -1,
    },
  }
  const expected = {
    selectedPod: {
      id: 1,
    },
  }
  const result = StepScriptUtil.setSelectedPod({ id: 1 }, stepScript)
  expect(result).toEqual(expected)
})

test('set selected actions 1', () => {
  const stepScript = {
    selectedActions: [123],
  }
  const expected = {
    selectedActions: [321],
  }
  const result = StepScriptUtil.setSelectedActions([321], stepScript)
  expect(result).toEqual(expected)
})
