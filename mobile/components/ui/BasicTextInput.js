import React from 'react'
import { View, ScrollView } from 'react-native'
import TextField from 'tweaked-native-text-input'

import ErrorText from './ErrorText'

const BasicTextInput = (props) => {
  return (
    <ScrollView>
      <TextField {...props} value={props.value || ''} />
      <ErrorText error={props.error} />
    </ScrollView>
  )
}

export default BasicTextInput
