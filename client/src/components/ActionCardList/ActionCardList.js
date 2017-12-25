import * as R from 'ramda'
import styled from 'styled-components'
import React, { Component } from 'react'
import ActionCard from '../ActionCard'
import settings from '../../settings'

const _CardList = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  > div {
    width: 24%;
  }
`

class ActionCardList extends Component {
  /**
   * Get action's bg color
   * If action styles.background-color is empty,
   * fallback to pod's background-color
   * @param pod
   * @param action
   * @returns {*}
   * @private
   */
  _getBgColor = (pod, action) => {
    const bgPath = R.lensPath(['styles', 'background-color'])
    const actionBg = R.view(bgPath, action)
    const podBg = R.compose(
      R.view(bgPath),
      R.head,
    )(pod)
    if (actionBg) {
      return actionBg
    } else if (podBg) {
      // If actionBg is somehow undefined, fallback to pod's bg color
      return podBg
    }
    // If neither actionBg and podBg are defined,
    // fallback to default color
    console.warn('Failed to retrieve any background-colors!')
    return settings.defaultCardBg
  }
  render() {
    const { pod, allActions, onClick } = this.props
    const cards = R.map((action) => {
      return (
        <ActionCard
          key={`ActionCard-${action.id}`}
          id={action.id}
          title={action.title}
          description={action.description}
          onClick={onClick}
          backgroundColor={this._getBgColor(pod, action)}
        />
      )
    }, allActions)
    return (
      <_CardList>
        {cards}
      </_CardList>
    )
  }
}

export default ActionCardList
