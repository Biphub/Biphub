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
`

const Icon = styled.img`
  width: 120px;
  height: 120px;
`

const PodName = styled.div`
  margin-top: 15px;
`

class PodCard extends Component {
  render() {
    const { icon, name, id, background } = this.props
    console.log('bg', background)
    return (
      <Wrapper style={{ background }}>
        <Icon src={icon} />
        <PodName>{name}</PodName>
      </Wrapper>
    )
  }
}

export default PodCard
