import * as R from 'ramda'
import styled from 'styled-components'
import React, { Component }  from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import SequenceRow from '../../components/SequenceRow'
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

const SequenceRowsStyled = styled(SequenceRow)`
  margin-top: 10px;
  margin-bottom: 10px;
`

class HomePage extends Component {
  componentDidMount() {

  }
  _onRowClick = (x) => {
    this.props.history.push(`/pipeline/${x.id}`)
  }
  render() {
    const { allPipelines, host } = this.props.data
    const getRows = (z) => {
      if (!z) {
        return null
      }
      return R.map(x => (
          <SequenceRowsStyled
            key={`SequenceRow-${x.id}`}
            host={host}
            onClick={() => this._onRowClick(x)}
            title={x.title}
          />
      ), z)
    }

    return (
      <App>
        <Jumbo>
          <AppLogo src={logo} alt="logo" />
          <h1>Welcome to Biphub</h1>
        </Jumbo>
        <PageIntro>
          {getRows(allPipelines)}
        </PageIntro>
      </App>
    );
  }
}

const HomepageQuery = gql`
  query {
    host
    allPipelines {
      id
      title
      description
      entryApp
      entryType
      nodes
    }
  }
`

export default graphql(HomepageQuery)(HomePage)
