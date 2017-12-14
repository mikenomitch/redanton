import React, { Component } from 'react'
import {
  StyleSheet,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { border, colors, spacing } from '../styleConstants'

import BasicTextInput from '../ui/BasicTextInput'
import ActionButton from '../ui/ActionButton'

import { userActions } from '../../data/users'
import { signUp } from '../../data/auth'

import {
  validateEmail,
  validatePassword,
  validatePresence,
  validateLength,
  combineValidations
} from '../../lib/validations'
import withValidation from '../helpers/withValidation'

import EditUserInfo from './EditUserInfo'

// ===============
//     STYLES
// ===============

const styles = StyleSheet.create({
  root: {
    paddingTop: 0,
    paddingLeft: spacing.container,
    paddingRight: spacing.container
  }
})

// ===============
//   VALIDATIONS
// ===============
const validations = {
  email: validateEmail('email not valid'),
  name: combineValidations(
    validatePresence('you must provide a name'),
    validateLength({min: 1, max: 60, msg: 'must be between 1 and 60 characters'})
  ),
  password: validatePassword('must be 6 characters or more'),
  passwordConfirmation: validatePassword('must be 6 or more characters')
}

// ===============
//    PRESENTER
// ===============

class SignUp extends Component {
  constructor(props){
    super(props)

    this.state = {
      email: null,
      name: null,
      password: null,
      passwordConfirmation: null
    }
	}

	signUp = () => {
    this.props.signUp({
      email: this.state.email,
      name: this.state.name,
      password: this.state.password,
      passwordConfirmation: this.state.passwordConfirmation
    })
  }

  // TODO: DRY THIS UP
  signUpClick = () => {
    this.props.unlessErrors(
      {
        email: this.state.email,
        name: this.state.name,
        password: this.state.password,
        passwordConfirmation: this.state.passwordConfirmation
      },
      this.signUp
    )
  }

  render() {
    const {email, password, passwordConfirmation, name} = this.state

    return (
      <View style={styles.root}>
        <BasicTextInput
          label="email"
          value={email}
					onChangeText={(email) => this.setState({email})}
					keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          error={this.props.errorFor('email', email)}
        />

        <EditUserInfo
          signUp
          errorFor={this.props.errorFor}
          userInfo={this.state}
          changeUserInfo={this.setState.bind(this)}
        />

        <ActionButton onPress={this.signUpClick}>
          sign up
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
  connect(null, { signUp })
)(SignUp)