import React, { Component } from 'react'
import styled from 'styled-components'
import PodCardList from '../../components/PodCardList'
import ActionCardList from '../../components/ActionCardList'
import Authentication from '../../components/Authentication'
import StepScript from '../../utils/StepScript'
import { CHOOSE_POD, CHOOSE_EVENT, AUTHENTICATION } from '../../settings'

const Container = styled.div`
  width: 100%;
  height: 100%;
`

class PipelineEditor extends Component {
  /**
   * Renders editor according to given condition
   * @returns {XML} | undefined
   * @private
   */
  _renderEditor = () => {
    const {
      stepTypeIndex,
      stepNameIndex,
      allPods,
      selectedPod,
      allActions,
      allPodAuths,
    } = this.props
    const stepName = StepScript.getStepName(stepTypeIndex, stepNameIndex)
    if (stepName === CHOOSE_POD) {
      return (
        <PodCardList
          allPods={allPods}
          onClick={id => this.props.onClickPodCard(stepTypeIndex, id)}
        />
      )
    } else if (stepName === CHOOSE_EVENT) {
      return (
        <ActionCardList
          selectedPod={selectedPod}
          allActions={allActions}
          onClick={id => this.props.onClickTriggerCard(stepTypeIndex, id)}
        />
      )
    } else if (stepName === AUTHENTICATION) {
      return <Authentication allPodAuths={allPodAuths} />
    }
  }

  render() {
    return <Container>{this._renderEditor()}</Container>
  }
}

export default PipelineEditor
