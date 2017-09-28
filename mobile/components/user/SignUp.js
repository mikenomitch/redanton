import React, { Component } from 'react'
import { View } from 'react-native'

import BasicTextInput from '../ui/BasicTextInput'
import BasicButton from '../ui/BasicButton'

import { connect } from 'react-redux'

import { userActions } from '../../data/users'
import { signUp } from '../../data/auth'

import EditUserInfo from './EditUserInfo'

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
      <View style={{paddingTop: 0, paddingLeft: 50, paddingRight: 50}}>
        <BasicTextInput
          label="email"
          value={email}
					onChangeText={(email) => this.setState({email})}
					keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <EditUserInfo userInfo={this.state} changeUserInfo={this.setState} />

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

export default connect(
  null,
  { signUp }
)(SignUp)
