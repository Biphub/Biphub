import * as R from 'ramda'
import styled from 'styled-components'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import PipelineComp from '../components/Pipeline'
import PipelineSidebar from '../components/PipelineSidebar'

const Page = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
`

const Pipeline = styled(PipelineComp)`
  border: 1px solid black !important;
  flex: 1;
`

const PipelineControls = styled(PipelineSidebar)`
  display: flex;
  flex-direction: column;
  width: 200px;
`

class PipelinePage extends Component {
  render() {
    const { pipeline, host, allPods } = this.props.data
    const nodes = R.prop('nodes', pipeline)
    const edges = R.prop('edges', pipeline)
    return (
      <Page>
        <PipelineControls
          host={host}
          pods={allPods}
        />
        <Pipeline
          nodes={nodes}
          edges={edges}
        />
      </Page>
    )
  }
}

const PipelineQuery = gql`
  query getPipeline($id: ID) {
    host
    pipeline(id: $id) {
      id
      nodes
      edges
    }
    allPods {
      id
      name
      title
      description
      icon
    }
  }
`

export default graphql(PipelineQuery, {
  options: (props) => {
    return {
      variables: {
        id: props.match.params.id || null
      }
    }
  }
})(PipelinePage)
