import * as R from 'ramda'
import styled from 'styled-components'
import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import ActionCard from '../ActionCard'
import settings from '../../settings'
import theme from '../../theme'

const _CardList = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  > div {
    width: 24%;
  }
`

const _SearchContainer = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const _SearchText = styled(TextField)`
  > div {
    box-sizing: border-box;
    border: 3px solid ${theme.tabActiveColor};
    border-radius: 20px;
    padding: 10px 20px;
  }
`

class ActionCardList extends Component {
  state = {
    search: '',
  }
  _onSearch = event => {
    const search = event.target.value
    this.setState({ search })
  }
  /**
   * Get action's bg color
   * If action styles.background-color is empty,
   * fallback to pod's background-color
   * @param selectedPod  // currently selected pod
   * @param action
   * @returns {*}
   * @private
   */
  _getBgColor = (selectedPod, action) => {
    const bgPath = R.lensPath(['styles', 'background-color'])
    const actionBg = R.view(bgPath, action)
    const podBg = R.compose(R.view(bgPath), R.head)(selectedPod)
    if (actionBg) {
      return actionBg
    } else if (podBg) {
      // If actionBg is somehow undefined, fallback to pod's bg color
      return podBg
    }
    return settings.defaultCardBg
  }
  render() {
    const { selectedPod, selectedPodActions, onClick } = this.props
    console.log('checking selected pod actions ', selectedPodActions)
    const cards = R.map(action => {
      return (
        <ActionCard
          key={`ActionCard-${action.id}`}
          id={action.id}
          title={action.title}
          description={action.description}
          onClick={onClick}
          backgroundColor={this._getBgColor(selectedPod, action)}
        />
      )
    }, selectedPodActions)
    return (
      <div>
        <_SearchContainer>
          <_SearchText
            placeholder="Search a pod..."
            InputProps={{
              disableUnderline: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={this._onSearch}
          />
        </_SearchContainer>
        <_CardList>{cards}</_CardList>
      </div>
    )
  }
}

export default ActionCardList
