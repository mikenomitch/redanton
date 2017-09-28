import React from 'react'
import { View } from 'react-native'

import BasicTextInput from '../ui/BasicTextInput'

const EditUserInfo = (props) => (
  <View>
    <BasicTextInput
      label="name"
      value={props.userInfo.name}
      onChangeText={(name) => props.changeUserInfo({name})}
      autoCorrect={false}
    />

    <BasicTextInput
      label="set password"
      value={props.userInfo.password}
      onChangeText={(password) => props.changeUserInfo({password})}
      secureTextEntry
    />

    <BasicTextInput
      label="confirm password"
      value={props.userInfo.passwordConfirmation}
      onChangeText={(passwordConfirmation) => props.changeUserInfo({passwordConfirmation})}
      secureTextEntry
    />
  </View>
)

export default EditUserInfo
