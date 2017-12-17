import React, { Component } from 'react'

class Icon extends Component {
  render() {
    const { type = 'pencil' } = this.props
    return <i className={`fa fa-${type}`} aria-hidden="true" />
  }
}

export default Icon
