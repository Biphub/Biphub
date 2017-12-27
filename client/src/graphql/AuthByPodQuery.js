import gql from 'graphql-tag'

export default gql`
  query AuthsByPod($podId: Int) {
    allPodAuths(podId: $podId) {
      id
      strategyType
      properties
    }
  }
`
