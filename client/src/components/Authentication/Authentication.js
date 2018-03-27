import * as R from 'ramda'
import styled from 'styled-components'
import React, { Component } from 'react'
import Tabs, { Tab } from 'material-ui/Tabs'
import TextField from 'material-ui/TextField'

const TabsContainer = styled.div`
  background-color: #499df3;
  color: white;
`

class Authentication extends Component {
  state = {
    tabValue: 0,
  }
  _handleTabChange = (event, tabValue) => {
    this.setState({ tabValue })
  }
  _getTabs = auths => {
    const { tabValue } = this.state
    const tabs = R.map(x => {
      const { strategyType } = x
      return <Tab label={strategyType} />
    }, auths)
    return (
      <TabsContainer>
        <Tabs value={tabValue} onChange={this._handleTabChange}>
          {tabs}
        </Tabs>
      </TabsContainer>
    )
  }
  /**
   * Integer value that represents index location inside allPodAuths
   * @param allPodAuths
   * @param tabValue
   * @returns {*}
   * @private
   */
  _renderContent = (allPodAuths, tabValue) => {
    const authIndex = R.lensIndex(tabValue)
    const podAuth = R.view(authIndex, allPodAuths)
    if (!podAuth) {
      return <div>Pod does not have any auth type!</div>
    }
    const { strategyType, properties } = podAuth
    if (strategyType === 'token') {
      const fields = R.mapObjIndexed(
        (num, key, val) => (
          <TextField
            key={`secret-${num}-${key}`}
            id={key}
            label={val.title}
            type="password"
            margin="normal"
          />
        ),
        properties,
      )
      return <div>{fields}</div>
    }
  }
  render() {
    const { tabValue } = this.state
    const { allPodAuths } = this.props
    const tabs = this._getTabs(allPodAuths)
    const edit = this._renderContent(allPodAuths, tabValue)
    return (
      <div>
        {tabs}
        {edit}
      </div>
    )
  }
}

export default Authentication
