import React from 'react'
import { View } from 'react-native'

import RNModalSelector from 'react-native-modal-selector'
import ErrorText from './ErrorText'

const ModalSelector = (props) => {
  return (
    <View>
      <RNModalSelector {...props} />
      <ErrorText error={props.error} />
    </View>
  )
}

export default ModalSelector
