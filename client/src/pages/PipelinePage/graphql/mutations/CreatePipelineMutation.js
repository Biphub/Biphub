import gql from 'graphql-tag'

export default gql`
  mutation createPipeline(
    $title: String!
    $entryApp: String!
    $entryType: String!
    $description: String!
    $nodes: JSON!
    $edges: JSON!
    $dataMaps: JSON!
  ) {
    createPipeline(
      title: $title
      entryApp: $entryApp
      entryType: $entryType
      description: $description
      nodes: $nodes
      edges: $edges
      dataMaps: $dataMaps
    ) {
      id
      title
    }
  }
`
