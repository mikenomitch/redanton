import React, { PureComponent } from 'react'
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native'
import { connect } from 'react-redux'

import { colors, spacing, font } from '../styleConstants'

import ActionButton from '../ui/ActionButton'
import ClubList from '../club/ClubList'

import { authActions } from '../../data/auth'

// ===============
//     STYLES
// ===============

const styles = StyleSheet.create({
  root: {
    padding: spacing.container,
    paddingTop: spacing.large
  },
  attributeHolder: {
    paddingTop: spacing.medium
  },
  attributeLabel: {
    fontWeight: font.heavyWeight,
    fontSize: font.medium
  },
  attribute: {
    fontWeight: font.lightWeight,
    fontSize: font.medium
  },
  signOutHolder: {
    marginBottom: spacing.large
  }
})

// ===============
//    PRESENTER
// ===============

// const defaultAvatar = 'http://www.archeosub.eu/images/BluLabTeamPeople/empty_user.png'

class Settings extends PureComponent {
  goToEdit = () => {
    this.props.navigation.navigate('EditUser', {userInfo: this.props.currentUser})
  }

  render() {
    return (
      <ScrollView style={styles.root}>
        <View style={styles.attributeHolder}>
          <Text style={styles.attributeLabel} > Name: </Text>
          <Text style={styles.attribute} > {this.props.currentUser.name} </Text>
        </View>

        <View style={styles.attributeHolder}>
          <Text style={styles.attributeLabel} > Email: </Text>
          <Text style={styles.attribute} > {this.props.currentUser.email} </Text>
        </View>

        <ActionButton onPress={this.goToEdit}>
          edit profile
        </ActionButton>

        <View style={styles.attributeHolder}>
          <Text style={styles.attributeLabel} > Clubs: </Text>
          <ClubList navigation={this.props.navigation} />
        </View>

        <View style={styles.signOutHolder}>
          <ActionButton onPress={this.props.signOut}>
            sign out
          </ActionButton>
        </View>
      </ScrollView>
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
