import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native'
import { StackNavigator } from 'react-navigation'

import { colors, font, spacing } from '../styleConstants'

import Login from './Login'
import SignUp from './SignUp'

import ActionButton from '../ui/ActionButton'

// ===============
//     STYLES
// ===============

const styles = StyleSheet.create({
  root: {
    paddingTop: 160,
    paddingLeft: spacing.container,
    paddingRight: spacing.container,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcomeText: {
    fontSize: font.extraLarge,
    paddingTop: spacing.large
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
          Welcome to Relayd
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
