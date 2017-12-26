import styled from 'styled-components'
import React, { Component } from 'react'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 240px;
  height: 240px;
  color: white;
  font-size: 20px;
  cursor: pointer;
`

const Icon = styled.img`
  width: 120px;
  height: 120px;
`

const PodName = styled.div`
  margin-top: 15px;
`

class PodCard extends Component {
  _onClick = (id) => {
    const { onClick } = this.props
    onClick(id)
  }
  render() {
    const { icon, name, id, background } = this.props
    return (
      <Wrapper
        style={{ background }}
        onClick={() => this._onClick(id)}
      >
        <Icon src={icon} />
        <PodName>{name}</PodName>
      </Wrapper>
    )
  }
}

export default PodCard
