import * as R from 'ramda'
import React, { Component } from 'react'
import OptionTextInput from '../OptionTextInput'
import settings from '../../settings'

class OptionsEditor extends Component {
  render() {
    const {
      selectedActionOptions,
      onUpdateOption
    } = this.props
    const getOptions = R.compose(
      R.values,
      R.mapObjIndexed((option, key) => {
        console.log('checking option ', option)
        if (option.type === settings.OPTIONS.types.string) {
          return (
            <OptionTextInput
              label={option.title}
              key={`OptionTextTemplate-${key}`}
              onUpdateOption={onUpdateOption}
            />
          )
        } else {
          throw Error('Unrecognised option field!', option)
        }
      }),
    )
    const options = getOptions(selectedActionOptions)
    return <div>{options}</div>
  }
}

export default OptionsEditor
