import React, { Component } from 'react'

import { Text, View } from 'react-native'
import BasicButton from '../ui/BasicButton'

// ===============
//    PRESENTER
// ===============

class LoginOrSignUp extends Component {
  constructor(props){
    super(props)
    this.state = {wat: 'sup'}
  }

  render() {
    return (
      <View style={{paddingTop: 200, paddingLeft: 50, paddingRight: 50}}>
        <BasicButton onPress={this.getInfo}>
          login
        </BasicButton>

        <Text> OR: </Text>

        <BasicButton onPress={this.getInfo}>
          sign up
        </BasicButton>
      </View>
    )
  }
}

// ===============
//   CONNECTION
// ===============

export default LoginOrSignUp
