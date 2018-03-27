import * as R from 'ramda'
import React, { Component } from 'react'
import styled from 'styled-components'
import TextField from 'material-ui/TextField'
import PodCard from '../PodCard'
import theme from '../../theme'

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

const _Container = styled.div`
  display: flex;
  flex-direction: column;
`

const _PodCardsContainer = styled.div`
  display: flex;
  flex-direction: row;
`

class PodCardList extends Component {
  state = {
    search: '',
  }
  _onClickPodCard = id => {
    const { onClick } = this.props
    if (onClick) {
      onClick(id)
    } else {
      console.warn('OnClick is undefined!')
    }
  }
  /**
   * Searchbox input onchange
   * @param event
   * @private
   */
  _onSearch = event => {
    this.setState({
      search: event.target.value,
    })
  }
  render() {
    const { allPods = [] } = this.props
    const { search } = this.state
    const bgPath = R.lensPath(['styles', 'background-color'])
    // Build pod cards
    const getPodCards = R.compose(
      R.map(x => (
        <PodCard
          key={`PodCard-${x.id}`}
          name={x.title}
          id={x.id}
          icon={x.icon}
          background={R.view(bgPath, x)}
          onClick={this._onClickPodCard}
        />
      )),
      R.filter(x => {
        if (!search) {
          return true
        }
        return R.compose(x => x.indexOf(search) !== -1, R.toLower)(x.title)
      }),
    )

    return (
      <_Container>
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
        <_PodCardsContainer>{getPodCards(allPods)}</_PodCardsContainer>
      </_Container>
    )
  }
}

export default PodCardList
