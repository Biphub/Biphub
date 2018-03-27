import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import 'normalize.css'
import 'vis/dist/vis.css'
import './index.css'
import PrimaryLayout from './layouts/PrimaryLayout'
import HomePage from './pages/HomePage/HomePage'
// import PodsPage from './pages/PodsPage'
import PipelinePage from './pages/PipelinePage'
import registerServiceWorker from './registerServiceWorker'

const routes = [
  <Route path="/" name="home" exact component={HomePage} />,
  <Route path="/pipeline" name="pipeline" component={PipelinePage} />,
  <Route path="/pipeline/:id" name="pipeline" component={PipelinePage} />,
]

const RouterApp = () => (
  <BrowserRouter>
    <PrimaryLayout routes={routes} />
  </BrowserRouter>
)

const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
  // to a different host
  link: new HttpLink({ uri: process.env.GRAPHQL_URI || '/graphql' }),
  cache: new InMemoryCache(),
})

const ApolloApp = () => (
  <ApolloProvider client={client}>
    <RouterApp />
  </ApolloProvider>
)

ReactDOM.render(<ApolloApp />, document.getElementById('root'))
registerServiceWorker()
