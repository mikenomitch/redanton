import React from 'react'
import {
  Text,
  View
} from 'react-native'

import BasicTextInput from '../ui/BasicTextInput'

const EditChannelInfo = (props) => (
  <View>
    <BasicTextInput
      label="name"
      value={props.channelInfo.name}
      returnKeyType="next"
      onChangeText={(name) => props.setChannelState({name})}
    />
    <BasicTextInput
      label="description"
      value={props.channelInfo.description}
      returnKeyType="next"
      onChangeText={(description) => props.setChannelState({description})}
    />
  </View>
)

export default EditChannelInfo
