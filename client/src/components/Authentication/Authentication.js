import React, { Component } from 'react'

class Authentication extends Component {
  render() {
    const { allPodAuths } = this.props
    console.log('auths ', allPodAuths)
    return (
      <div>
        auth!!
      </div>
    )
  }
}

export default Authentication
