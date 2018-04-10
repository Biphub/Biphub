import * as R from 'ramda'
import debounce from 'lodash/debounce'
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

  componentWillMount() {
    const { onUpdateOption } = this.props
    this._onUpdateOption = debounce(onUpdateOption, 1000)
  }

  /**
   * Handle text field change
   * @private
   */
  _handleChange = value => {
    const { id } = this.props
    this.setState(
      { value },
      () => this._onUpdateOption(id, value)
    )
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
          onChange={(e) => this._handleChange(e.target.value)}
          margin="normal"
        />
      </div>
    )
  }
}

export default withStyles()(OptionTextTemplate)
