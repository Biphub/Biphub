import TextField from 'material-ui/TextField'
import { withStyles } from 'material-ui/styles'
import React, { Component } from 'react'

class OptionTextTemplate extends Component {
  state = {
    value: 'Controlled',
  }
  /**
   * Handle text field change
   * @private
   */
  _handleChange = e => {
    this.setState({
      value: e.target.value,
    })
  }

  render() {
    const {
      classes,
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
          className={classes.textField}
          margin="normal"
        />
      </div>
    )
  }
}

export default withStyles()(OptionTextTemplate)
