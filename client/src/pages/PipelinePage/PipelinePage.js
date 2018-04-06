import * as R from 'ramda'
import styled from 'styled-components'
import React, { Component } from 'react'
import { graphql, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import Button from 'material-ui/Button'
import PipelineEditor from '../../components/PipelineEditor'
import PipelineSteps from '../../components/PipelineSteps'
import StepScriptUtil from '../../utils/StepScript'
import ACTION_QUERY from '../../graphql/queries/ActionsByPodQuery'
import AUTH_QUERY from '../../graphql/queries/AuthByPodQuery'

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
    stepScript: StepScriptUtil.init(),
    activeStep: {
      index: 0,
      type: 'event',
      step: 'choosePod',
    },
    // Stores values
    steps: [],
    // Current states
    selectedPod: {},
    allActions: [],
    allPodAuths: [],
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
    this.props.client
      .query({
        query: ACTION_QUERY,
        variables: {
          podId,
        },
      })
      .then(res => {
        const { stepScript } = this.state
        const newStepScript = R.compose(
          x => StepScriptUtil.setNextStep(groupIndex, 0, x),
          x => StepScriptUtil.setStepValue(groupIndex, 'podId', podId, x),
        )(stepScript)
        this.setState(
          {
            stepScript: newStepScript,
          },
          () => {
            const podPath = R.lensPath(['data', 'allPods'])
            const actionsPath = R.lensPath(['data', 'allActions'])
            // TODO: change querying aginst allPod to just pod
            const selectedPod = R.compose(
              R.head,
              R.view(podPath)
            )(res)
            const allActions = R.view(actionsPath, res)
            // Assign pod and actions to the stepScript
            const stepScript = R.compose(
              (script) => StepScriptUtil.setSelectedActions(allActions, script),
              (script) => StepScriptUtil.setSelectedPod(selectedPod, script)
            )(this.state.stepScript)

            this.setState({ stepScript })
          },
        )
      })
  }
  /**
   * On click action
   * @param groupIndex
   * @param triggerId
   * @private
   */
  _onClickTriggerCard = (groupIndex, triggerId) => {
    const { stepScript, selectedPod } = this.state
    this.props.client
      .query({
        query: AUTH_QUERY,
        variables: {
          podId: selectedPod.id,
        },
      })
      .then(res => {
        const authLens = R.lensPath(['data', 'allPodAuths'])
        const allPodAuths = R.view(authLens, res)
        const newStepScript = R.compose(
          x => StepScriptUtil.setNextStep(groupIndex, 1, x),
          x => StepScriptUtil.setStepValue(groupIndex, 'triggerId', triggerId, x),
        )(stepScript)
        this.setState(
          {
            stepScript: newStepScript,
            allPodAuths,
          },
          () => console.log('checking step scr ', this.state.stepScript),
        )
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
      editing: [groupIndex, stepIndex],
    }
    const newScript = R.merge(stepScript, newEdit)
    this.setState({
      stepScript: newScript,
    })
  }
  _onSubmitClick = () => {
    const { stepScript } = this.state
    const result = StepScriptUtil.convertToPipelineData(stepScript)
    console.log('checking onsubmit result: ', result)
    this.props.client
      .mutate({
        variables: {
          title: "Test pipeline",
          entryApp: "ASD2",
          entryType: "webhook",
          description: "Test pipeline desc",
          nodes: "[{'id': 1, 'podName': 'biphub-pod-fake1', 'actionName': 'webhook'}]",
          edges: "[]",
          dataMaps: "[]"
        }
      })
      .then(res => {
        console.log('mutation success ', res)
      })
  }
  render() {
    const {
      activeStep,
      numberOfActions,
      stepScript,
    } = this.state
    const { allPods = [] } = this.props.data
    const [stepTypeIndex, stepNameIndex] = stepScript.editing
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
              stepTypeIndex={stepTypeIndex}
              stepNameIndex={stepNameIndex}
              selectedPod={stepScript.selectedPod}
              allActions={stepScript.selectedActions}
              allPodAuths={[]}
              index={activeStep.index}
              type={activeStep.type}
              step={activeStep.step}
              onClickPodCard={this._onClickPodCard}
              onClickTriggerCard={this._onClickTriggerCard}
            />
            <Button
              raised
              color="primary"
              onClick={this._onSubmitClick}
            >
              Submit
            </Button>
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
