import * as R from 'ramda'
import styled from 'styled-components'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import PipelineSteps from '../../components/PipelineSteps'
import PodCardList from '../../components/PodCardList'

const Page = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
`

const Editor = styled.div`
  display: flex;
  box-sizing: border-box;
  padding: 40px 160px;
  width: 100%;
`

const EditorContent = styled.div`
  border: 1px solid black;
  width: 100%;
  height: 100%;
`

class PipelinePage extends Component {
  state = {
    activeStep: {
      type: 'trigger',
      step: 'choosePod'
    }
  }
  /**
   * @param type
   * @param step
   * @private
   */
  _renderEditorContent = (type, step) => {
    const { allPods = [] } = this.props.data
    console.log('checking ', type, step)
    if (type === 'trigger' && step === 'choosePod') {
      return (
        <PodCardList
          allPods={allPods}
        />
      )
    }
  }
  /**
   * Change currently active step
   * @param type
   * @param step
   * @private
   */
  _onStepChange = (type, step) => {
    this.setState({
      activeStep: { type, step }
    })
  }
  render() {
    const { activeStep } = this.state
    return (
      <Page>
        <PipelineSteps
          numberOfActions={2}
          active={activeStep}
          onChange={this._onStepChange}
        />
        <Editor>
          <EditorContent>
            {this._renderEditorContent(activeStep.type, activeStep.step)}
          </EditorContent>
        </Editor>
      </Page>
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

export default graphql(PipelinePageQuery)(PipelinePage)