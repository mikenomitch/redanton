import React, { Component } from 'react'

import {
  Button,
  View,
  Image,
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
      <View style={{padding: 80}}>
        <Text> Email: {this.props.currentUser.email} </Text>
        <Text> Avatar: </Text>
        <Image
          style={{width: 50, height: 50}}
          source={{uri: this.props.currentUser.avatar}}
        />
        <View style={{paddingTop: 50}}>
          <Button title="Sign Out" onPress={this.props.signOut} />
        </View>
      </View>
    )
  }
}

// ===============
//   CONNECTION
// ===============

const mapStateToProps = (state) => {
  return {
    currentUser: state.auth && state.auth.currentUser || {}
  }
}

export default connect(
  mapStateToProps,
  {signOut: authActions.clearCreds}
)(Settings)
