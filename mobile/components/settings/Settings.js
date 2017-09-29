import React, { Component } from 'react'

import {
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native'

import BasicButton from '../ui/BasicButton'
import ClubList from '../club/ClubList'

import { connect } from 'react-redux'

import { authActions } from '../../data/auth'

// ===============
//     STYLES
// ===============

const styles = StyleSheet.create({
  root: {
    padding: 20
  },
  attributeHolder: {
    paddingTop: 10
  },
  attributeLabel: {
    fontWeight: '600',
    fontSize: 16
  },
  attribute: {
    fontWeight: '100',
    fontSize: 16
  },
  avatar: {
    width: 50,
    height: 50
  }
})

// ===============
//    PRESENTER
// ===============

const defaultAvatar = 'http://www.archeosub.eu/images/BluLabTeamPeople/empty_user.png'

class Settings extends Component {
  goToEdit = () => {
    this.props.navigation.navigate('EditUser', {userInfo: this.props.currentUser})
  }

  render() {
    return (
      <View style={styles.root}>
        <View style={styles.attributeHolder}>
          <Text style={styles.attributeLabel} > Name: </Text>
          <Text style={styles.attribute} > {this.props.currentUser.name} </Text>
        </View>

        <View style={styles.attributeHolder}>
          <Text style={styles.attributeLabel} > Email: </Text>
          <Text style={styles.attribute} > {this.props.currentUser.email} </Text>
        </View>

        <BasicButton onPress={this.goToEdit}>
          edit profile
        </BasicButton>

        <View style={styles.attributeHolder}>
          <Text style={styles.attributeLabel} > Clubs: </Text>
          <ClubList navigation={this.props.navigation} />
        </View>


        <BasicButton onPress={this.props.signOut}>
          sign out
        </BasicButton>
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
  {signOut: authActions.signOut}
)(Settings)
