import styled from 'styled-components'
import React, { Component }  from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import _PodCardList from '../../components/PodCardList'
import logo from '../../assets/logo.svg'

const App = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Jumbo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
  color: #323232;
`

const AppLogo = styled.img`
  animation: App-logo-spin infinite 20s linear;
  height: 80px;
  @keyframes App-logo-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

const PageIntro = styled.div`
  flex: 1;
`

class HomePage extends Component {

  render() {
    const { allPods = [] } = this.props.data
    return (
      <App>
        <Jumbo>
          <AppLogo src={logo} alt="logo" />
          <h1>Welcome to Biphub</h1>
        </Jumbo>
        <PageIntro>
          <_PodCardList allPods={allPods} />
        </PageIntro>
      </App>
    );
  }
}

const HomepageQuery = gql`
  query {
    allPods {
      id
      title
      icon
      styles
    }
  }
`

export default graphql(HomepageQuery)(HomePage)
