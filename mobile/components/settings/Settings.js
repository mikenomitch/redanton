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
      <View style={{padding: 60}}>
        <Text> Email: {this.props.currentUser.email} </Text>
        <Text> Avatar: </Text>
        <Image
          style={{width: 50, height: 50}}
          source={{uri: this.props.currentUser.avatar}}
        />
        <Text> Club Memberships: </Text>
        <Text> Brain Food (member) </Text>
        <View style={{paddingTop: 30}}>
          <Button title="Sign Out" onPress={this.props.signOut} />
        </View>
        <View style={{paddingTop: 20}}>
          <Text style={{paddingBottom: 15, fontWeight: 'bold'}}> features coming soon: </Text>
          <Text style={{paddingBottom: 5}}> New Channel Creation</Text>
          <Text style={{paddingBottom: 5}}> UX/UI Improvements </Text>
          <Text style={{paddingBottom: 5}}> New Club Creation </Text>
          <Text style={{paddingBottom: 5}}> User Invites and Sign Up </Text>
          <Text style={{paddingBottom: 5}}> Sorting Posts by Recent Activity </Text>
          <Text style={{paddingBottom: 5}}> Push Notifications </Text>
          <Text style={{paddingBottom: 5}}> Notification Configuration </Text>
          <Text style={{paddingBottom: 5}}> Website/App Equivalence </Text>
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
