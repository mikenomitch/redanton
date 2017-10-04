import React, { Component } from 'react'
import {
  StyleSheet,
  View
} from 'react-native'
import { compose } from 'redux'
import { connect } from 'react-redux'

import { spacing } from '../styleConstants'

import BasicTextInput from '../ui/BasicTextInput'
import ActionButton from '../ui/ActionButton'

import { userActions } from '../../data/users'
import { signIn } from '../../data/auth'

import { validatePresence } from '../../lib/validations'
import withValidation from '../helpers/withValidation'

// ===============
//     STYLES
// ===============

const styles = StyleSheet.create({
  root: {
    paddingTop: 140,
    paddingLeft: spacing.container,
    paddingRight: spacing.container
  }
})

// ===============
//    PRESENTER
// ===============

const validations = {
  email: validatePresence('you must provide an email'),
  password: validatePresence('you must provide a password')
}

class Login extends Component {
  constructor(props){
    super(props)

    this.state = {
      email: null,
      password: null
    }
	}

	getInfo = () => {
    this.props.signIn({
      email: this.state.email,
      password: this.state.password
    })
  }

  onLoginClick = () => {
    this.props.unlessErrorsFor(
      {email: this.state.email, password: this.state.password},
      this.getInfo
    )
  }

  render() {
    const {email, password} = this.state

    return (
      <View style={styles.root}>
        <BasicTextInput
          placeholder="email"
          value={email}
					onChangeText={(email) => this.setState({email})}
					keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          error={this.props.errorFor('email', email)}
        />

        <BasicTextInput
          placeholder="password"
          value={password}
          onChangeText={(password) => this.setState({password})}
          error={this.props.errorFor('password', password)}
					secureTextEntry
        />

        <ActionButton onPress={this.onLoginClick}>
          login
        </ActionButton>
      </View>
    )
  }
}

// ===============
//   CONNECTION
// ===============

export default compose(
  withValidation(validations),
  connect(null, { signIn })
)(Login)
