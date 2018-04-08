import gql from 'graphql-tag'

export default gql`
  query {
    allPods {
      id
      title
      icon
      styles
    }
  }
`
