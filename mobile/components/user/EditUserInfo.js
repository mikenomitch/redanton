import React from 'react'
import { View, Text } from 'react-native'

import BasicTextInput from '../ui/BasicTextInput'

const EditUserInfo = (props) => (
  <View>
    <BasicTextInput
      label="first name"
      value={props.userInfo.name}
      onChangeText={(name) => props.changeUserInfo({name})}
      autoCorrect={false}
      error={props.errorFor('name', props.userInfo.name)}
    />

    { !props.signUp && (
      <Text>
        Leave Password fields blank if you don't wish to change your password.
      </Text>
    )}

    { !props.signUp && (
      <BasicTextInput
        label="current password"
        value={props.userInfo.currentPassword}
        onChangeText={(currentPassword) => props.changeUserInfo({currentPassword})}
        secureTextEntry
        error={props.errorFor('currentPassword', props.userInfo.currentPassword)}
      />
    )}

    <BasicTextInput
      label="password"
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
