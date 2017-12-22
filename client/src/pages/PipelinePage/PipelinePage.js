import * as R from 'ramda'
import styled from 'styled-components'
import React, { Component } from 'react'
import { graphql, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import PipelineEditor from '../../components/PipelineEditor'
import PipelineSteps from '../../components/PipelineSteps'
import {

} from '../../settings'
import settings from '../../settings'
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

const SearchActionsByPodQuery = gql`
  query ActionsByPod($id: Int) {
      allActions(podId: $id) {
        id
        title
        trigger
      }
    }
`

class PipelinePage extends Component {
  state = {
    numberOfActions: 1,
    // Currently active step
    activeStep: {
      index: 0,
      type: 'event',
      step: 'choosePod'
    },
    // Stores values
    steps: []
  }
  componentWillMount() {
    const steps = this._initSteps(this.state.numberOfActions + 1)
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

  _onClickPodCard = (index, type, step, id) => {
    this.props.client.query({
      query: SearchActionsByPodQuery,
      variables: {
        id
      }
    }).then((res) => {
      const stepData = this._setStep(index, step, id)
      const nextStep = this._getNextStep(index, type, step)
      this.setState({
        activeStep: {
          index: nextStep.index,
          type: nextStep.type,
          step: nextStep.step
        },
        step: stepData
      }, () => {
        const { activeStep, step } = this.state
        console.log('checking active step after ss', activeStep)
        console.log('checking step value ', step)
      })
    })
  }
  /**
   * Change currently active step
   * @param index
   * @param type
   * @param step
   * @private
   */
  _onStepChange = (index, type, step) => {
    this.setState({
      activeStep: { index, type, step }
    })
  }
  render() {
    const { activeStep, numberOfActions } = this.state
    const { allPods = [] } = this.props.data
    return (
      <_Page>
        <PipelineSteps
          numberOfActions={numberOfActions}
          active={activeStep}
          onChange={this._onStepChange}
        />
        <_Editor>
          <_EditorContent>
            <PipelineEditor
              allPods={allPods}
              index={activeStep.index}
              type={activeStep.type}
              step={activeStep.step}
              onClickPodCard={this._onClickPodCard}
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