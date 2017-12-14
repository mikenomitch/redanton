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
      error={props.errorFor('name', props.clubInfo.name)}
    />
    <BasicTextInput
      autoGrow
      label="description"
      value={props.clubInfo.description}
      returnKeyType="next"
      onChangeText={(description) => props.setClubState({description})}
      error={props.errorFor('description', props.clubInfo.description)}
    />
  </View>
)

export default EditClubInfo
