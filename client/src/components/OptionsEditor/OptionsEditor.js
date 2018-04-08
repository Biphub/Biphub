import * as R from 'ramda'
import React, { Component } from 'react'
import OptionTextTemplate from '../OptionTextTemplate'
import settings from '../../settings'

class OptionsEditor extends Component {
  render() {
    const { selectedActionOptions } = this.props
    const getOptions = R.compose(
      R.values,
      R.mapObjIndexed((option, key) => {
        if (option.type === settings.OPTIONS.types.string) {
          return (
            <OptionTextTemplate
              key={`OptionTextTemplate-${key}`}
            />
          )
        } else {
          throw Error('Unrecognised option field!', option)
        }
      })
    )
    const options = getOptions(selectedActionOptions)
    console.log(options)
    return (
      <div>
        {options}
      </div>
    )
  }
}

export default OptionsEditor
