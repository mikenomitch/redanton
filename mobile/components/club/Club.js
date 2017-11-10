import React, { PureComponent } from 'react'
import {
  Button,
  Text,
  StyleSheet,
  View
} from 'react-native'
import { connect } from 'react-redux'

import {colors, spacing, font, border} from '../styleConstants'

import { confirmMessage } from '../../lib/uiActions'
import { leaveClub } from '../../data/clubs'

import {
  getMemberships,
  elevateMembership,
  kickMember
} from '../../data/memberships'

import Footer from '../ui/Footer'

// ===============
//    CHILDREN
// ===============

var membershipItemStyles = StyleSheet.create({
  root: {
    borderBottomWidth: border.width,
    borderBottomColor: colors.border,
    display: 'inline-flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    flexDirection: 'row',
    padding: spacing.medium
  },
  info: {
    width: '33%'
  },
  elevationHolder: {
    width: '33%',
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  elevationButton: {
    fontWeight: '100'
  },
  kickHolder: {
    width: '33%',
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  kickButton:{
    fontWeight: '100'
  },
  name: {
    fontSize: font.medium
  }
})

class MembershipItem extends PureComponent {
  get membership () {
    return this.props.membership
  }

  get isAdmin () {
    return this.membership.type === "admin"
  }

  renderElevation () {
    if (!this.isAdmin && this.props.currentUserIsAdmin) {
      const onPress = () => confirmMessage(
        'Make Admin',
        'Are you sure? This action is permanent.',
        this.props.elevateMembership
      )

      return (
        <View style={membershipItemStyles.elevationHolder} key="elevate">
          <Button
            style={membershipItemStyles.elevationButton}
            title="make admin"
            onPress={onPress}
          />
        </View>
      )
    }
  }

  renderKickUser () {
    if (!this.isAdmin && this.props.currentUserIsAdmin) {

      const onPress = () => confirmMessage(
        'Kick User',
        'Are you sure? This action is permanent.',
        this.props.kickMember
      )

      return (
        <View style={membershipItemStyles.kickHolder} key="kick">
          <Button
            style={membershipItemStyles.kickButton}
            title="kick"
            onPress={onPress}
          />
        </View>
      )
    }
  }

  displayName() {
    return this.props.user.name || this.props.user.email
  }

  render() {
    return (
      <View style={membershipItemStyles.root}>
        <View style={membershipItemStyles.info} key="info">
          <Text style={membershipItemStyles.name}> {this.displayName()} </Text>
        </View>
        {this.renderElevation()}
        {this.renderKickUser()}
      </View>
    )
  }
}

// ===============
//    PRESENTER
// ===============

var clubStyles = StyleSheet.create({
  root: {},
  editClubButton: {},
  leaveClubButton: {},
  inviteButton: {},
  inviteMemberHolder: {},
  content: {
    height: '90%'
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.medium
  },
  membershipsHeader: {
    fontWeight: '600',
    fontSize: font.medium
  },
  footerContent: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  }
})

class Club extends PureComponent {
  componentDidMount() {
    this.props.getMemberships(this.club.id)
  }

  get club() {
    return this.props.navigation.state.params.club
  }

  userForMembership (membership) {
    return Object.values(this.props.users).filter((u) => u.id === membership.user_id)[0] || {email: 'unknown user'}
  }

  leaveClubPress = () => {
    confirmMessage(
      'Leave Club',
      'Are you sure? This action is permanent.',
      () => {this.props.leaveClub(this.club.id, this.props.navigation.goBack)}
    )
  }

  kickMemberCall = (membershipId) => () => {
    this.props.kickMember(
      membershipId,
      alert('member kicked')
    )
  }

  elevateMembershipCall = (membershipId) => () => {
    this.props.elevateMembership(
      membershipId,
      alert('member made admin')
    )
  }

  renderMemberships () {
    return this.props.memberships.map((membership) => (
      <MembershipItem
        currentUserIsAdmin={this.props.currentUserIsAdmin}
        key={membership.user_id}
        membership={membership}
        elevateMembership={this.elevateMembershipCall(membership.id)}
        kickMember={this.kickMemberCall(membership.id)}
        user={this.userForMembership(membership)}
      />
    ))
  }

  renderEdit() {
    if (this.props.currentUserIsAdmin) {
      return (
        <Button title="Edit Club"
          style={clubStyles.editClubButton}
          onPress={() => this.props.navigation.navigate('EditClub', {clubInfo: this.club})}
        />
      )
    }
  }

  renderMemberIniviteLink() {
    return (
      <View style={clubStyles.inviteMemberHolder}>
        <Button
          title="+ Member"
          style={clubStyles.inviteButton}
          onPress={() => this.props.navigation.navigate('Invite', {clubId: this.club.id})}
        />
      </View>
    )
  }

  render() {
    return (
      <View style={clubStyles.root} >
        <View style={clubStyles.content}>
          <View style={clubStyles.headerContent}>
            <Text style={clubStyles.membershipsHeader}>
              Members:
            </Text>
            {this.renderMemberIniviteLink()}
          </View>
          {this.renderMemberships()}
        </View>
        <Footer>
          <View style={clubStyles.footerContent}>
            <Button
              style={clubStyles.leaveClubButton}
              title="Leave Club"
              onPress={this.leaveClubPress}
            />
            {this.renderEdit()}
          </View>
        </Footer>
      </View>
    )
  }
}

// ===============
//   CONNECTION
// ===============

const mapStateToProps = (state, props) => {
  const users = state.users
  const clubId = props.navigation.state.params.club.id
  const memberships = Object.values(state.memberships).filter(
    (m) => m.club_id === clubId
  )

  const membershipForCurrentUser = memberships.filter(
    (m) => m.user_id === state.auth.currentUser.id
  )[0] || {}

  const currentUserIsAdmin = membershipForCurrentUser.type === "admin"

  return {
    memberships,
    users,
    currentUserIsAdmin
  }
}

export default connect(
  mapStateToProps, {
    getMemberships,
    leaveClub,
    elevateMembership,
    kickMember
  }
)(Club)
