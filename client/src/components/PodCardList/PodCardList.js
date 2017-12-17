import * as R from 'ramda'
import { getOr } from 'lodash/fp'
import React, { Component }  from 'react'
import styled from 'styled-components'
import TextField from 'material-ui/TextField'
import PodCard from '../PodCard'
import theme from '../../theme'

const SearchContainer = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const SearchText = styled(TextField)`
  > div {
    box-sizing: border-box;
    border: 3px solid ${theme.tabActiveColor};
    border-radius: 20px;
    padding: 10px 20px;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const PodCardsContainer = styled.div`
  display: flex;
  flex-direction: row;
`

class PodCardList extends Component {
  state = {
    search: ''
  }
  _onClickPodCard = (id) => {
    const { onClick } = this.props
    onClick(id)
  }
  /**
   * Searchbox input onchange
   * @param event
   * @private
   */
  _onSearch = (event) => {
    this.setState({
      search: event.target.value,
    })
  }
  render() {
    const {
      allPods = [],
    } = this.props
    const {
      search
    } = this.state
    // Build pod cards
    const getPodCards = R.compose(
      R.map(x => <PodCard
        key={`PodCard-${x.id}`}
        name={x.title}
        id={x.id}
        icon={x.icon}
        background={getOr(undefined, 'styles.background-color', x)}
        onClick={this._onClickPodCard}
      />),
      R.filter((x) => {
        if (!search) {
          return true
        }
        return R.compose(
          x => x.indexOf(search) !== -1,
          R.toLower
        )(x.title)
      })
    )

    return (
      <Container>
        <SearchContainer>
          <SearchText
            placeholder='Search a pod...'
            InputProps={{
              disableUnderline: true,
            }}
            InputLabelProps={{
              shrink: true
            }}
            onChange={this._onSearch}
          />
        </SearchContainer>
        <PodCardsContainer>
          {getPodCards(allPods)}
        </PodCardsContainer>
      </Container>
    )
  }
}

export default PodCardList
