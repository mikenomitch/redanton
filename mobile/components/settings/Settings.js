import React, { Component } from 'react'

import {
  View,
  Image,
  Text
} from 'react-native'

import BasicButton from '../ui/BasicButton'
import ClubList from '../club/ClubList'

import { connect } from 'react-redux'

import { authActions } from '../../data/auth'

// ===============
//    PRESENTER
// ===============

class Settings extends Component {
  goToEdit = () => {
    this.props.navigation.navigate('EditUser', {userInfo: this.props.currentUser})
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

        <BasicButton onPress={this.goToEdit}>
          edit profile
        </BasicButton>

        <ClubList navigation={this.props.navigation} />

        <BasicButton onPress={this.props.signOut}>
          sign out
        </BasicButton>

        <View style={{paddingTop: 20}}>
          <Text style={{paddingBottom: 15, fontWeight: 'bold'}}> features coming soon: </Text>
          <Text style={{paddingBottom: 5}}> UX Improvements </Text>
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
