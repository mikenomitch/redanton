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
      error={props.errorFor('name', props.userInfo.name)}
    />

    <BasicTextInput
      label="set password"
      value={props.userInfo.password}
      onChangeText={(password) => props.changeUserInfo({password})}
      secureTextEntry
      error={props.errorFor('password', props.userInfo.password)}
    />

    <BasicTextInput
      label="confirm password"
      value={props.userInfo.passwordConfirmation}
      onChangeText={(passwordConfirmation) => props.changeUserInfo({passwordConfirmation})}
      secureTextEntry
      error={props.errorFor('passwordConfirmation', props.userInfo.passwordConfirmation)}
    />
  </View>
)

export default EditUserInfo
