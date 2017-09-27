import React, { Component } from 'react'
import { View } from 'react-native'

import BasicTextInput from '../ui/BasicTextInput'
import BasicButton from '../ui/BasicButton'

import { connect } from 'react-redux'

import { userActions } from '../../data/users'
import { signUp } from '../../data/auth'

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
          placeholder="email"
          value={email}
					onChangeText={(email) => this.setState({email})}
					keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <BasicTextInput
          placeholder="name"
          value={name}
          onChangeText={(name) => this.setState({name})}
          autoCorrect={false}
        />

        <BasicTextInput
          placeholder="password"
          value={password}
					onChangeText={(password) => this.setState({password})}
					secureTextEntry
        />

        <BasicTextInput
          placeholder="confirmation"
          value={passwordConfirmation}
          onChangeText={(passwordConfirmation) => this.setState({passwordConfirmation})}
          secureTextEntry
        />

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
