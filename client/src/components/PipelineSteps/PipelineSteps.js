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
   * @param givenIndex
   * @param type = type to activate
   * @param step = step to activate
   * @private
   */
  _onStepClick = (givenIndex, type, step) => {
    const { onChange } = this.props
    onChange(givenIndex, type, step)
  }

  /**
   * Render givenIndex steps from strings file
   * @param givenIndex
   * @param givenType = current steps type trigger | action
   * @param steps
   * @returns {XML}
   * @private
   */
  _renderStep = (givenIndex, givenType, steps) => {
    const { active } = this.props
    const rendered = mapIndexed((x, index) => {
      if (
        givenIndex === active.index &&
        givenType === active.type &&
        x.name === active.step
      ) {
        return (
          <StepButtonActive
            key={`${index}_${x.name}`}
            onClick={
              () => this._onStepClick(givenIndex, givenType, x.name)
            }
          >
            <Icon type='pencil' />
            <StepButtonLabel>{x.title}</StepButtonLabel>
          </StepButtonActive>
        )
      }
      return (
        <StepButtonInactive
          key={`${index}_${x.name}`}
          onClick={() => this._onStepClick(givenIndex, givenType, x.name)}
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
