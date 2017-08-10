import React from 'react'

import {
	AsyncStorage,
  Button,
  View,
  TextInput,
  Text
} from 'react-native'

import { connect } from 'react-redux'

import { post } from '../../lib/fetcher'
import { userActions } from '../../data/users'

class Auth extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      email: null,
      password: null
    }
	}

	componentDidMount(){
		this.props.addUsers()
	}

	getInfo = () => {
    post(
			'/api_login/v1',
			{
				email: this.state.email,
				password: this.state.password
			},
			{useNonApi: true}
		).then( (data) => {
      AsyncStorage.setItem('jwt', data.jwt, () => {
        this.setState({
          isLoading: false,
          jwt: data.jwt
        })
      })
    })
	}

  render() {
		// note: this should be local state
		// only showing the prop so I can prove redux
		// is hooked up properly
		const email = this.props.email
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

export default connect(
	mapStateToProps,
	userActions
)(Auth)
