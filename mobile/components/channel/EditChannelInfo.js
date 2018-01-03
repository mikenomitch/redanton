import React from 'react'
import { View } from 'react-native'

import BasicTextInput from '../ui/BasicTextInput'

const EditChannelInfo = (props) => (
  <View>
    <BasicTextInput
      label="name"
      value={props.channelInfo.name}
      returnKeyType="next"
      onChangeText={(name) => props.setChannelState({name})}
      error={props.errorFor('name', props.channelInfo.name)}
    />
  </View>
)

export default EditChannelInfo
