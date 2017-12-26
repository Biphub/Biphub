import * as R from 'ramda'
import styled from 'styled-components'
import React, { Component } from 'react'
import { graphql, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import PipelineEditor from '../../components/PipelineEditor'
import PipelineSteps from '../../components/PipelineSteps'
import settings from '../../settings'
import StepScript from '../../StepScript'
import ACTION_QUERY from '../../graphql/ActionsByPodQuery'
const mapIndexed = R.addIndex(R.map)

const _Page = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
`

const _Editor = styled.div`
  display: flex;
  box-sizing: border-box;
  padding: 40px 120px;
  width: 100%;
`

const _EditorContent = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
`

class PipelinePage extends Component {
  state = {
    numberOfActions: 1,
    // Currently active step
    stepScript: StepScript.init(),
    activeStep: {
      index: 0,
      type: 'event',
      step: 'choosePod'
    },
    // Stores values
    steps: [],
    // Current states
    selectedPod: {},
    allActions: [],
  }
  componentWillMount() {
    const steps = this._initSteps(this.state.numberOfActions + 1)
    console.log('checking stepscript ', this.state.stepScript)
    this.setState({ steps })
  }

  _activeStep = (index, type, step) => ({
    index, type, step
  })
  /**
   * Create initial steps according to number of steps
   * @param number
   * @returns {*}
   * @private
   */
  _initSteps = (number) => {
    return mapIndexed((x, index) => {
      // If x is not empty, simply return it back
      // TODO: Handle payload merge
      if (x) {
        return x
      }
      // 0 is always a trigger
      if (index === 0) {
        return {
          choosePod: '',
          chooseTrigger: '',
          authentication: '',
          setupOptions: '',
          testSetup: '',
        }
      }
      return {
        choosePod: '',
        chooseAction: '',
        authentication: '',
        setupTemplates: '',
        testSetup: '',
      }
    }, new Array(number))
  }
  /**
   * Set step value
   * @param index
   * @param step
   * @param value
   * @private
   */
  _setStep = (index, step, value) => {
    const { steps } = this.state
    const xLens = R.lens(R.prop(step), R.assoc(step))
    const iLens = R.lensIndex(index)
    const getStep = R.compose(
      x => R.set(xLens, value, x),
      x => x[index]
    )
    return R.set(iLens, getStep(steps))(steps)
  }
  /**
   * Get next step from settings type
   * @param index
   * @param type
   * @param step
   * @private
   */
  _getNextStep = (index, type, step) => {
    const getType = (X) => {
      if (X === 'event') {
        return settings.STEP_EVENT
      }
      return settings.STEP_ACTION
    }
    const currentType = getType(type)
    const currentStepIdx = R.findIndex(
      R.propEq('name', step), currentType
    )
    // If this is undefined it should increase type index
    const nextStep = currentType[currentStepIdx + 1]
    // handle max length

    // Return the next step of current type
    return this._activeStep(index, type, nextStep.name)
  }
  /**
   * Set state according to getNextStep value
   * @param index
   * @param type
   * @param step
   * @private
   */
  _moveNextStep = (index, type, step) => {
    const nextStep = this._getNextStep(index, type, step)
    this.setState({
      activeStep: {
        index: nextStep.index,
        type: nextStep.type,
        step: nextStep.step
      }
    })
  }

  /**
   * Clicking on a pod results in fetching
   * actions by pod id
   * @param groupIndex
   * @param id
   * @private
   */
  _onClickPodCard = (groupIndex, id) => {
    this._fetchActionByPodId(groupIndex, id)
  }
  /**
   * On click action
   * @param index
   * @param type
   * @param step
   * @param id
   * @private
   */
  _onClickAction = (index, type, step, id) => {
    console.log('checking click action ', index, type, step, id)
  }
  /**
   * Fetches actions by pod id. It results in changing current navigation
   * context
   * @param groupIndex
   * @param podId
   * @private
   */
  _fetchActionByPodId = (groupIndex, podId) => {
    this.props.client.query({
      query: ACTION_QUERY,
      variables: {
        podId
      }
    }).then((res) => {
      const { stepScript } = this.state
      const newStepScript = R.compose(
        x => StepScript.setNextStep(groupIndex, 0, x),
        x => StepScript.setGroupValue(
          groupIndex,
          'podId',
          podId,
          x
        )
      )(stepScript)
      // Setting stepscript
      this.setState({
        stepScript: newStepScript
      }, () => {
        const podPath = R.lensPath(['data', 'allPods'])
        const actionsPath = R.lensPath(['data', 'allActions'])
        const selectedPod = R.view(podPath, res)
        const allActions = R.view(actionsPath, res)
        // Setting selected pod and allActions of the pod
        this.setState({
          selectedPod,
          allActions
        })
      })
    })
  }
  /**
   * Change currently editing step
   * @param groupIndex
   * @param stepIndex
   * @private
   */
  _onStepChange = (groupIndex, stepIndex) => {
    const { stepScript } = this.state
    const newEdit = {
      editing: [groupIndex, stepIndex]
    }
    const newScript = R.merge(stepScript, newEdit)
    this.setState({
      stepScript: newScript
    })
  }
  render() {
    const {
      activeStep,
      numberOfActions,
      allActions = [],
      selectedPod = {},
      stepScript,
    } = this.state
    const {
      allPods = [],
    } = this.props.data
    console.log('rendering selected pod ', selectedPod)
    return (
      <_Page>
        <PipelineSteps
          stepScript={stepScript}
          numberOfActions={numberOfActions}
          active={activeStep}
          onChange={this._onStepChange}
        />
        <_Editor>
          <_EditorContent>
            <PipelineEditor
              allPods={allPods}
              stepScript={stepScript}
              selectedPod={selectedPod}
              allActions={allActions}
              index={activeStep.index}
              type={activeStep.type}
              step={activeStep.step}
              onClickPodCard={this._onClickPodCard}
              onClickAction={this._onClickAction}
            />
          </_EditorContent>
        </_Editor>
      </_Page>
    )
  }
}

const PipelinePageQuery = gql`
  query {
    allPods {
      id
      title
      icon
      styles
    }
  }
`

const ApolloPipelinePage = withApollo(PipelinePage)
export default graphql(PipelinePageQuery)(ApolloPipelinePage)