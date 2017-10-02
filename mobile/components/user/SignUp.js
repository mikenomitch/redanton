import React, { Component } from 'react'
import {
  StyleSheet,
  View
} from 'react-native'

import BasicTextInput from '../ui/BasicTextInput'
import ActionButton from '../ui/ActionButton'

import { connect } from 'react-redux'

import { userActions } from '../../data/users'
import { signUp } from '../../data/auth'

import EditUserInfo from './EditUserInfo'

// ===============
//     STYLES
// ===============

const styles = StyleSheet.create({
  root: {
    paddingTop: 0,
    paddingLeft: 50,
    paddingRight: 50
  }
})

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

	getInfo = () => {
    this.props.signUp({
      email: this.state.email,
      name: this.state.name,
      password: this.state.password,
      passwordConfirmation: this.state.passwordConfirmation
    })
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
        />

        <EditUserInfo userInfo={this.state} changeUserInfo={this.setState.bind(this)} />

        <ActionButton onPress={this.getInfo}>
          sign up
        </ActionButton>
      </View>
    )
  }
}

// ===============
//   CONNECTION
// ===============

export default connect(
  null,
  { signUp }
)(SignUp)
