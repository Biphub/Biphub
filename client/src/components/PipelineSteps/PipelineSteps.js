import * as R from 'ramda'
import React, { Component } from 'react'
import styled from 'styled-components'
import TextField from 'material-ui/TextField'
import _Icon from '../Icon'
import settings from '../../settings'
import theme from '../../theme'
const mapIndexed = R.addIndex(R.map);

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
    active: {
      type: 'trigger',
      step: 'choosePod'
    }
  }
  /**
   *
   * @param type = type to activate
   * @param step = step to activate
   * @private
   */
  _onStepClick = (type, step) => {
    const { onChange } = this.props
    onChange(type, step)
  }

  /**
   * Render given steps from strings file
   * @param givenType = current steps type trigger | action
   * @param steps
   * @returns {XML}
   * @private
   */
  _renderStep = (givenType, steps) => {
    const { active } = this.props
    const rendered = mapIndexed((x, givenIndex) => {
      if (givenType === active.type && x.name === active.step) {
        return (
          <StepButtonActive
            key={`${givenIndex}_${x.name}`}
            onClick={() => this._onStepClick(givenType, x.name)}
          >
            <_Icon type='pencil' />
            <StepButtonLabel>{x.title}</StepButtonLabel>
          </StepButtonActive>
        )
      }
      return (
        <StepButtonInactive
          key={`${givenIndex}_${x.name}`}
          onClick={() => this._onStepClick(givenType, x.name)}
        >
          <_Icon type='lock' />
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
        return this._renderStep('trigger', settings.STEP_TRIGGER)
      }
      return this._renderStep('action', settings.STEP_ACTION)
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
      </Container>
    )
  }
}

export default PipelineSteps
