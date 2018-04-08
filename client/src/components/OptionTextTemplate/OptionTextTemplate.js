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
    const { classes } = this.props
    return (
      <div>
        <TextField
          id="multiline-flexible"
          label="Multiline"
          multiline
          rowsMax="4"
          value={this.state.multiline}
          onChange={this._handleChange}
          className={classes.textField}
          margin="normal"
        />
      </div>
    )
  }
}

export default withStyles()(OptionTextTemplate)
