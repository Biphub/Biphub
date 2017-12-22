import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class PodsPage extends Component {
  render() {
    return (
      <div>
        pods
      </div>
    )
  }
}

const PodsPageQuery = gql`  
  query {
      allPods {
          id
          name
      }
  }
`

export default graphql(PodsPageQuery)(PodsPage)
