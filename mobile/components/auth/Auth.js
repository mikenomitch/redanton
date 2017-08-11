import React, { Component } from 'react'

import {
	AsyncStorage,
  Button,
  View,
  TextInput,
  Text
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { userActions } from '../../data/users'
import { authThunks } from '../../data/auth'

class Auth extends Component {
  constructor(props){
    super(props)

    this.state = {
      email: null,
      password: null
    }
	}

	getInfo = () => {
    this.props.signIn({
      email: this.props.email,
      password: this.state.password
    })
	}

  render() {
		// note: this should be local state
		// only showing the prop so I can prove redux
		// is hooked up properly
		const email = this.state.email
    const {password} = this.state

    return (
      <View style={{paddingTop: 200, paddingLeft: 50, paddingRight: 50}}>
        <TextInput
          style={{height: 60, fontSize: 18}}
          placeholder="email"
          value={email}
					onChangeText={(email) => this.setState({email})}
					keyboardType="email-address"
        />

        <TextInput
          style={{height: 60, fontSize: 18}}
          placeholder="password"
          value={password}
					onChangeText={(password) => this.setState({password})}
					secureTextEntry
        />

        <Button title="Login" onPress={this.getInfo} />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
	const email = state.users[1] && state.users[1].email
	return {email}
}

const mapDispatchToProps = (dispatch) => {
  return	{
	  signIn: bindActionCreators(authThunks.signIn, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth)
