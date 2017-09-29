import React from 'react'

import { View } from 'react-native'

import BasicTextInput from '../ui/BasicTextInput'

const EditClubInfo = (props) => (
  <View>
    <BasicTextInput
      label="name"
      value={props.clubInfo.name}
      returnKeyType="next"
      onChangeText={(name) => props.setClubState({name})}
    />
    <BasicTextInput
      label="description"
      value={props.clubInfo.description}
      returnKeyType="next"
      onChangeText={(description) => props.setClubState({description})}
    />
  </View>
)

export default EditClubInfo
