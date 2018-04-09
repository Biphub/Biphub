import * as R from 'ramda'
import TextField from 'material-ui/TextField'
import { withStyles } from 'material-ui/styles'
import React, { Component } from 'react'

class OptionTextTemplate extends Component {
  state = {
    value: 'Controlled',
  }
  constructor() {
    super()
    this.setState.bind(this)
  }
  /**
   * Handle text field change
   * @private
   */
  _handleChange = e => {
    const { onUpdateOption } = this.props
    const { value } = e.target
    onUpdateOption(value)
    this.setState({ value })
  }

  render() {
    const {
      label = 'Text field',
      rowMax = 4,
      fullWidth = true,
      labelShrink = true
    } = this.props
    return (
      <div>
        <TextField
          label={label}
          multiline
          fullWidth={fullWidth}
          rowsMax={rowMax}
          value={this.state.multiline}
          InputLabelProps={{
            shrink: labelShrink,
          }}
          onChange={this._handleChange}
          margin="normal"
        />
      </div>
    )
  }
}

export default withStyles()(OptionTextTemplate)
