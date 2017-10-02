import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native'

import Login from './Login'
import SignUp from './SignUp'

import ActionButton from '../ui/ActionButton'
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

        <ActionButton onPress={this.goTo('Login')}>
          login
        </ActionButton>

        <ActionButton onPress={this.goTo('SignUp')}>
          sign up
        </ActionButton>
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
