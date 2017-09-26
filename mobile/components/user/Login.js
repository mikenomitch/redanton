import React, { Component } from 'react'
import { View } from 'react-native'

import BasicTextInput from '../ui/BasicTextInput'
import BasicButton from '../ui/BasicButton'

import { connect } from 'react-redux'

import { userActions } from '../../data/users'
import { signIn } from '../../data/auth'

// ===============
//    PRESENTER
// ===============

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

  render() {
    const {email, password} = this.state

    return (
      <View style={{paddingTop: 200, paddingLeft: 50, paddingRight: 50}}>
        <BasicTextInput
          placeholder="email"
          value={email}
					onChangeText={(email) => this.setState({email})}
					keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <BasicTextInput
          placeholder="password"
          value={password}
					onChangeText={(password) => this.setState({password})}
					secureTextEntry
        />

        <BasicButton onPress={this.getInfo}>
          login
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
  { signIn }
)(Login)
