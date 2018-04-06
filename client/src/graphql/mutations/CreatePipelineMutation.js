import gql from 'graphql-tag'

export default gql`
  mutation createPipeline($title, $entryApp, $entryType, $description, $nodes, $edges, $dataMaps) {
    createPipeline(
      title: $title,
      entryApp: $entryApp
      entryType: $entryType,
      description: $description,
      nodes: $nodes
      edges: "[]"
      dataMaps: "[]"
    ) {
      id
      title
    }
  }
`
