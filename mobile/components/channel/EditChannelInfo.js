import React from 'react'

import {
  Text,
  TextInput,
  View
} from 'react-native'

const EditChannelInfo = (props) => (
  <View>
    <Text> name: </Text>
    <TextInput
      style={{height: 60, fontSize: 18}}
      placeholder="name"
      value={props.channelInfo.name}
      returnKeyType="next"
      onChangeText={(name) => props.setChannelState({name})}
    />
    <Text> description: </Text>
    <TextInput
      style={{height: 60, fontSize: 18}}
      placeholder="description"
      value={props.channelInfo.description}
      returnKeyType="next"
      onChangeText={(description) => props.setChannelState({description})}
    />
  </View>
)

export default EditChannelInfo
