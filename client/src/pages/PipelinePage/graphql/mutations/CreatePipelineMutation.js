import gql from 'graphql-tag'

export default gql`
  mutation createPipeline(
    $title: String!
    $entryApp: String!
    $entryType: String!
    $description: String!
    $stepScript: JSON!
  ) {
    createPipeline(
      title: $title
      entryApp: $entryApp
      entryType: $entryType
      description: $description
      stepScript: $stepScript
    ) {
      id
      title
    }
  }
`
