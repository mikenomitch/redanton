import React, { Component } from 'react'
import { Text, View } from 'react-native'

import Login from './Login'
import SignUp from './SignUp'

import BasicButton from '../ui/BasicButton'

// ===============
//    PRESENTER
// ===============

class LoginOrSignUp extends Component {
  constructor(props){
    super(props)
    this.state = {
      choice: 'login'
    }
  }

  render() {
    if (this.state.choice === 'login') {
      return <Login />
    }

    if (this.state.choice === 'signUp') {
      return <SignUp />
    }

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
