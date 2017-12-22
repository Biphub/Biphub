export const CHOOSE_POD = 'choosePod'
export const CHOOSE_EVENT = 'chooseEvent'
export const AUTHENTICATION = 'authentication'
export const SETUP_OPTIONS = 'setupOptions'
export const TEST_SETUP = 'testSetup'
export const CHOOSE_ACTIONS = 'chooseAction'
export const SETUP_TEMPLATES = 'setupTemplates'

export default {
  theme: 'default',

  STEP_EVENT: [
    { name: CHOOSE_POD, title: 'Choose Pod' },
    { name: CHOOSE_EVENT, title: 'Choose Event' },
    { name: AUTHENTICATION, title: 'Authentication' },
    { name: SETUP_OPTIONS, title: 'Setup Options' },
    { name: TEST_SETUP, title: 'Test Setup' }
  ],
  STEP_ACTION: [
    { name: CHOOSE_POD, title: 'Choose Pod' },
    { name: CHOOSE_ACTIONS, title: 'Choose Action' },
    { name: AUTHENTICATION, title: 'Authentication' },
    { name: SETUP_TEMPLATES, title: 'Setup Templates' },
    { name: TEST_SETUP, title: 'Test Setup' }
  ]
}