import React, { Component } from 'react'
import styled from 'styled-components'

const _Card = styled.div`
  cursor: pointer;
  color: white;
  width: 250px;
  height: 210px;
  box-sizing: border-box;
  padding: 20px 40px;
  border-radius: 10px;
`

const _CardHeader = styled.h3``

const _CardDesc = styled.div``

class ActionCard extends Component {
  _onClick = (id) => {
    this.props.onClick(id)
  }
  render() {
    const {
      id,
      title,
      description,
      backgroundColor
    } = this.props
    return (
      <_Card
        onClick={() => this._onClick(id)}
        style={{
          backgroundColor
        }}
      >
        <_CardHeader>{title}</_CardHeader>
        <_CardDesc>{description}</_CardDesc>
      </_Card>
    )
  }
}

export default ActionCard
