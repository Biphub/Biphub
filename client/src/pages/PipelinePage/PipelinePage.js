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
   * On click action
   * @param groupIndex
   * @param triggerId
   * @private
   */
  _onClickTriggerCard = (groupIndex, triggerId) => {
    const { stepScript } = this.state
    const newStepScript = R.compose(
      x => StepScript.setNextStep(groupIndex, 1, x),
      x => StepScript.setGroupValue(groupIndex, 'triggerId', triggerId, x)
    )(stepScript)
    this.setState({
      stepScript: newStepScript
    }, () => console.log('checking step scr ', this.state.stepScript))
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
    console.log('Checking stepscript', stepScript)
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
              onClickTriggerCard={this._onClickTriggerCard}
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