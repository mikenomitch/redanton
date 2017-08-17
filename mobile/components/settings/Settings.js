import React, { Component } from 'react'

import {
  Button,
  View,
  Text
} from 'react-native'

import { connect } from 'react-redux'

import { authActions } from '../../data/auth'

// ===============
//    PRESENTER
// ===============

class Settings extends Component {
  render() {
    return (
      <View style={{padding: 100}}>
        <Text> SETTINGS GO HERE </Text>
        <Button title="Sign Out" onPress={this.props.signOut} />
      </View>
    )
  }
}

// ===============
//   CONNECTION
// ===============

export default connect(
  null,
  {signOut: authActions.clearCreds}
)(Settings)
