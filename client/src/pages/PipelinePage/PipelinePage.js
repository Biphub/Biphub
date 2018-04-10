import * as R from 'ramda'
import styled from 'styled-components'
import React, { Component } from 'react'
import { graphql, withApollo } from 'react-apollo'
import Button from 'material-ui/Button'
import PipelineEditor from '../../components/PipelineEditor'
import PipelineSteps from '../../components/PipelineSteps'
import StepScriptUtil from '../../utils/StepScript'
import PAGE_QUERY from './graphql/queries/PipelinePageQuery'
import ACTION_QUERY from './graphql/queries/ActionsByPodQuery'
import CREATE_PIPELINE_MUTATION from './graphql/mutations/CreatePipelineMutation'

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
  }

  /**
   * Clicking on a pod results in fetching
   * actions by pod id
   * @param groupIndex
   * @param podId
   * @private
   */
  _onClickPodCard = (groupIndex, podId) => {
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
            const selectedPod = R.compose(R.head, R.view(podPath))(res)
            const podActions = R.view(actionsPath, res)
            // Assign pod and actions to the stepScript
            const stepScript = R.compose(
              script =>
                StepScriptUtil.setSelectedPodActions(podActions, script),
              script => StepScriptUtil.setSelectedPod(selectedPod, script),
            )(this.state.stepScript)
            this.setState({ stepScript })
          },
        )
      })
  }
  /**
   * On click action
   * States, stepScript and selectedPod
   * @param groupIndex
   * @param actionId
   * @private
   */
  _onClickAction = (groupIndex, actionId) => {
    const { stepScript } = this.state
    this.props.client
      .query({
        query: ACTION_QUERY,
        variables: {
          podId: stepScript.selectedPod.id,
        },
      })
      .then(res => {
        const authLens = R.lensPath(['data', 'allPodAuths'])
        const allPodAuths = R.view(authLens, res)

        // Client side search an action from actions list
        const findSelectedPodAction = (actions, id) =>
          R.find(R.propEq('id', id))(actions)
        const selectedPodAction = findSelectedPodAction(
          res.data.allActions,
          actionId,
        )

        const newStepScript = R.compose(
          script =>
            StepScriptUtil.setSelectedActionOptions(
              selectedPodAction.imports.properties,
              script,
            ),
          script => StepScriptUtil.setSelectedAction(selectedPodAction, script),
          script => StepScriptUtil.setNextStep(groupIndex, 1, script),
          script =>
            StepScriptUtil.setStepValue(
              groupIndex,
              'triggerId',
              actionId,
              script,
            ),
        )(stepScript)
        console.log('checking new script ', newStepScript)
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
   * @param groupIndex
   * @param id
   * @param value
   */
  _onUpdateOption = (groupIndex, id, value) => {
    const { stepScript } = this.state
    const newScript = StepScriptUtil.setStepValue(
      groupIndex,
      ['options', id],
      value,
      stepScript
    )
    this.setState({
      stepScript: newScript
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
    console.log('submitting stepscript ', stepScript)
    // const result = StepScriptUtil.convertToPipelineData(stepScript)
    this.props.client
      .mutate({
        mutation: CREATE_PIPELINE_MUTATION,
        variables: {
          title: "Test pipeline",
          entryApp: "ASD2",
          entryType: "webhook",
          description: "Test pipeline desc",
          stepScript: stepScript
        }
      })
      .then(res => {
        console.log('mutation success ', res)
      })
  }
  render() {
    const { activeStep, numberOfActions, stepScript } = this.state
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
              selectedPodActions={stepScript.selectedPodActions}
              allPodAuths={[]}
              selectedActionOptions={stepScript.selectedActionOptions}
              index={activeStep.index}
              type={activeStep.type}
              step={activeStep.step}
              onClickPodCard={this._onClickPodCard}
              onClickTriggerCard={this._onClickAction}
              onUpdateOption={this._onUpdateOption}
            />
            <Button raised color="primary" onClick={this._onSubmitClick}>
              Submit
            </Button>
          </_EditorContent>
        </_Editor>
      </_Page>
    )
  }
}

const ApolloPipelinePage = withApollo(PipelinePage)
export default graphql(PAGE_QUERY)(ApolloPipelinePage)
