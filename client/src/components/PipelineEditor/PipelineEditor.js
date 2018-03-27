import React, { Component } from 'react'
import styled from 'styled-components'
import PodCardList from '../../components/PodCardList'
import ActionCardList from '../../components/ActionCardList'
import Authentication from '../../components/Authentication'
import StepScript from '../../StepScript'
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
      stepScript,
      allPods,
      selectedPod,
      allActions,
      allPodAuths,
    } = this.props
    const [x, y] = stepScript.editing
    const stepName = StepScript.getStepName(x, y)
    if (stepName === CHOOSE_POD) {
      return (
        <PodCardList
          allPods={allPods}
          onClick={id => this.props.onClickPodCard(x, id)}
        />
      )
    } else if (stepName === CHOOSE_EVENT) {
      return (
        <ActionCardList
          pod={selectedPod}
          allActions={allActions}
          onClick={id => this.props.onClickTriggerCard(x, id)}
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
