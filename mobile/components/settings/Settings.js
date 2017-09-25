import React, { Component } from 'react'

import {
  Button,
  View,
  Image,
  Text
} from 'react-native'

import BasicButton from '../ui/BasicButton'

import { connect } from 'react-redux'

import { getClubs } from '../../data/clubs'
import { authActions } from '../../data/auth'

// ===============
//    PRESENTER
// ===============

class Settings extends Component {
  componentDidMount () {
    this.props.getClubs()
  }

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
        {this.props.clubs.map(
          (c) => (<Text> {c.name} (member) </Text>)
        )}

        <BasicButton onPress={this.props.signOut}>
          sign out
        </BasicButton>

        <View style={{paddingTop: 20}}>
          <Text style={{paddingBottom: 15, fontWeight: 'bold'}}> features coming soon: </Text>
          <Text style={{paddingBottom: 5}}> UX Improvements </Text>
          <Text style={{paddingBottom: 5}}> Push Notifications </Text>
          <Text style={{paddingBottom: 5}}> User Invites and Sign Up </Text>
          <Text style={{paddingBottom: 5}}> Notification Configuration </Text>
          <Text style={{paddingBottom: 5}}> Website/App Equivalence </Text>
          <Text style={{paddingBottom: 5}}> New Club Creation </Text>
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
    clubs: Object.values(state.clubs),
    currentUser: state.auth && state.auth.currentUser || {}
  }
}

export default connect(
  mapStateToProps,
  {signOut: authActions.clearCreds, getClubs}
)(Settings)
