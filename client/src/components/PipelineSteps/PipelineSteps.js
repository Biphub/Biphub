import * as R from 'ramda'
import React, { Component } from 'react'
import styled from 'styled-components'
import TextField from 'material-ui/TextField'
import Icon from '../Icon'
import settings from '../../settings'
import theme from '../../theme'
const mapIndexed = R.addIndex(R.map)

const Container = styled.div`
  width: 400px;
  height: 100%;
`

// Group of step buttons
const Step = styled.div`
  min-height: 120px;
  width: 100%;
  margin-bottom: 20px;
`

const StepButtonInactive = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #828282;
  padding: 5px 10px;
  cursor: pointer;
`

const StepButtonActive = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  background-color: ${theme.tabActiveBg};
  color: ${theme.tabActiveColor};
  padding: 5px 10px;
`

const StepButtonLabel = styled.div`
  margin-left: 5px;
`

/**
 * args:
 * - numberOfActions = number of actions to display (this is excluding trigger)
 * event:
 * onStepClick:
 *   emits:
 *     { type: "TRIGGER", name: "setPod" }
 */
class PipelineSteps extends Component {
  state = {
    // Currently active step
    active: {
      index: 0,
      type: 'event',
      step: 'choosePod'
    }
  }
  /**
   *
   * @param groupIndex
   * @param stepIndex
   * @private
   */
  _onStepClick = (groupIndex, stepIndex) => {
    const { onChange } = this.props
    onChange(groupIndex, stepIndex)
  }

  /**
   * Render givenIndex steps from strings file
   * @param groupIndex
   * @param givenType = current steps type trigger | action
   * @param steps
   * @returns {XML}
   * @private
   */
  _renderStep = (groupIndex, givenType, steps) => {
    const { stepScript } = this.props
    const rendered = mapIndexed((x, stepIndex) => {
      const [xGroupIndex, yStepIndex] = stepScript.editing
      if (
        groupIndex === xGroupIndex &&
        stepIndex === yStepIndex
      ) {
        return (
          <StepButtonActive
            key={`${groupIndex}_${stepIndex}_${x.name}`}
            onClick={
              () => this._onStepClick(groupIndex, stepIndex)
            }
          >
            <Icon type='pencil' />
            <StepButtonLabel>{x.title}</StepButtonLabel>
          </StepButtonActive>
        )
      }
      return (
        <StepButtonInactive
          key={`${groupIndex}_${stepIndex}_${x.name}`}
          onClick={() => this._onStepClick(groupIndex, stepIndex)}
        >
          <Icon type='lock' />
          <StepButtonLabel>{x.title}</StepButtonLabel>
        </StepButtonInactive>
      )
    }, steps)
    return (
      <Step>
        {rendered}
      </Step>
    )
  }

  render() {
    const { numberOfActions = 1 } = this.props
    const actionSteps = mapIndexed((x, index) => {
      if (index === 0) {
        // Index 0 is always trigger step
        return this._renderStep(index, 'event', settings.STEP_EVENT)
      }
      return this._renderStep(index, 'action', settings.STEP_ACTION)
    }, new Array(numberOfActions + 1))
    return (
      <Container>
        <div>
          <TextField
            placeholder='Pipeline title'
          />
        </div>
        <div>
          {actionSteps}
        </div>
        <div>
          add step
        </div>
      </Container>
    )
  }
}

export default PipelineSteps
