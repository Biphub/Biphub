import * as R from 'ramda'
import styled from 'styled-components'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import PipelineSteps from '../../components/PipelineSteps'

const Page = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
`

class PipelinePage extends Component {
  render() {
    return (
      <Page>
        <PipelineSteps
          numberOfActions={2}
        />
        testzz
      </Page>
    )
  }
}

export default PipelinePage