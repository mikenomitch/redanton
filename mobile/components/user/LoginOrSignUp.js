import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native'

import Login from './Login'
import SignUp from './SignUp'

import BasicButton from '../ui/BasicButton'
import { StackNavigator } from 'react-navigation'

// ===============
//     STYLES
// ===============

const styles = StyleSheet.create({
  root: {
    paddingTop: 160,
    paddingLeft: 50,
    paddingRight: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcomeText: {
    fontSize: 22,
    paddingTop: 15
  }
})

// ===============
//    PRESENTER
// ===============

class LoginOrSignUp extends Component {
  goTo = (location) => () => {
    this.props.navigation.navigate(location)
  }

  render() {
    return (
      <View style={styles.root}>
        <Text style={styles.welcomeText}>
          Welcome to Danton
        </Text>

        <BasicButton onPress={this.goTo('Login')}>
          login
        </BasicButton>

        <BasicButton onPress={this.goTo('SignUp')}>
          sign up
        </BasicButton>
      </View>
    )
  }
}

// ===============
//   CONNECTION
// ===============

export default StackNavigator({
  Root: {
    screen: LoginOrSignUp
  },
  Login: {
    screen: Login
  },
  SignUp: {
    screen: SignUp
  }
})
