import { getOr } from 'lodash/fp'
import * as R from 'ramda'
import styled from 'styled-components'
import React, { Component } from 'react'
import { graphql, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import PipelineSteps from '../../components/PipelineSteps'
import PodCardList from '../../components/PodCardList'
import settings from '../../settings'
const mapIndexed = R.addIndex(R.map)

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
    activeStep: {
      index: 0,
      type: 'trigger',
      step: 'choosePod'
    },
    steps: []
  }
  componentWillMount() {
    const steps = mapIndexed((x, index) => {
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
    }, new Array(this.state.numberOfActions + 1))
    this.setState({
      steps
    })
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
  _onClickSelectPod = R.curry((index, type, step, id) => {
    this.props.client.query({
      query: SearchActionsByPodQuery,
      variables: {
        id
      }
    }).then((res) => {
      const { steps } = this.state
      const xLens = R.lens(R.prop(step), R.assoc(step))
      const iLens = R.lensIndex(index)
      const getStep = R.compose(
        x => R.set(xLens, id, x),
        x => x[index]
      )
      const newSteps = R.set(iLens, getStep(steps))(steps)
      console.log(newSteps)
      // const nextStep = this._getNextStep(index, type, step)
      console.log('checking res ', res, index, type, step, id)

    })
  })
  /**
   * @param index
   * @param type
   * @param step
   * @private
   */
  _renderEditorContent = (index, type, step) => {
    const { allPods = [] } = this.props.data
    if (type === 'trigger' && step === 'choosePod') {
      return (
        <PodCardList
          allPods={allPods}
          onClick={this._onClickSelectPod(index, type, step)}
        />
      )
    }
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
    const { activeStep, numberOfActions, steps } = this.state
    console.log('checking active step ', steps)
    return (
      <Page>
        <PipelineSteps
          numberOfActions={numberOfActions}
          active={activeStep}
          onChange={this._onStepChange}
        />
        <Editor>
          <EditorContent>
            {this._renderEditorContent(
              activeStep.index,
              activeStep.type,
              activeStep.step
            )}
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

const ApolloPipelinePage = withApollo(PipelinePage)
export default graphql(PipelinePageQuery)(ApolloPipelinePage)