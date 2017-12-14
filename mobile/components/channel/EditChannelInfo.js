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
    <BasicTextInput
      autoGrow
      label="description"
      value={props.channelInfo.description}
      returnKeyType="next"
      onChangeText={(description) => props.setChannelState({description})}
      error={props.errorFor('description', props.channelInfo.description)}
    />
  </View>
)

export default EditChannelInfo
