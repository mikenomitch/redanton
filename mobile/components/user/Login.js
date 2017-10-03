import React, { Component } from 'react'
import {
  StyleSheet,
  View
} from 'react-native'
import { connect } from 'react-redux'

import { spacing } from '../styleConstants'

import BasicTextInput from '../ui/BasicTextInput'
import ActionButton from '../ui/ActionButton'

import { userActions } from '../../data/users'
import { signIn } from '../../data/auth'

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
      <View style={styles.root}>
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

        <ActionButton onPress={this.getInfo}>
          login
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
  { signIn }
)(Login)
