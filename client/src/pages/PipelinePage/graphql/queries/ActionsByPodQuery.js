import gql from 'graphql-tag'

export default gql`
  query ActionsByPod($podId: Int) {
    allPods(id: $podId) {
      id
      styles
    }
    allActions(podId: $podId) {
      id
      title
      description
      trigger
      styles
      imports
      exports
    }
  }
`
