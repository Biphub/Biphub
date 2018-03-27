import * as R from 'ramda'
import styled from 'styled-components'
import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid #eee;
  padding: 5px;
  cursor: pointer;
`

const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 200px;
  overflow: hidden;
`

const Icon = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid #eee;
  background-color: #f6f6f6;
  padding: 10px;
  img {
    width: 40px;
  }
  :after {
    position: absolute;
    right: -10px;
    content: '>';
  }
  margin-right: 10px;
`

const Title = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const styles = theme => ({
  cardAction: {
    display: 'none',
  },
})

class SequenceRow extends Component {
  _onClick = () => {
    this.props.onClick()
  }
  render() {
    const { host, flattenSequence = [], title, className } = this.props
    const getIcons = R.compose(x =>
      R.map(z => {
        // Otherwise generate it as an icon
        return (
          <Icon>
            <img src={`${host}${z.icon}`} />
          </Icon>
        )
      }, x),
    )
    return (
      <Row className={className} onClick={this._onClick}>
        <IconContainer>{getIcons(flattenSequence)}</IconContainer>
        <Title>{title}</Title>
      </Row>
    )
  }
}

export default withStyles(styles)(SequenceRow)
