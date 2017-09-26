import React, {Component} from 'react'

import {
  Button,
  Text,
  View
} from 'react-native'

import { connect } from 'react-redux'

import { confirmMessage } from '../../lib/uiActions'

import {
  leaveClub
} from '../../data/clubs'

import {
  getMemberships,
  elevateMembership,
  kickMember
} from '../../data/memberships'

import Footer from '../ui/Footer'

// ===============
//    CHILDREN
// ===============

class MembershipItem extends Component {
  get membership () {
    return this.props.membership
  }

  get isAdmin () {
    return this.membership.type === "admin"
  }

  renderElevation () {
    if (!this.isAdmin && this.props.currentUserIsAdmin) {
      return (
        <View key="elevate">
          <Button title="make admin" onPress={() => confirmMessage(
            'Make Admin',
            'Are you sure? This action is permanent.',
            this.props.elevateMembership
          )} />
        </View>
      )
    }
  }

  renderKickUser () {
    if (!this.isAdmin && this.props.currentUserIsAdmin) {
      return (
        <View key="kick">
          <Button title="kick from club" onPress={() => confirmMessage(
            'Kick User',
            'Are you sure? This action is permanent.',
            this.props.kickMember
          )} />
        </View>
      )
    }
  }

  render() {
    return (
      <View
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <View key="info">
          <Text> Membership for: {this.props.user.name} </Text>
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

class Club extends Component {
  get club() {
    return this.props.navigation.state.params.club
  }

  componentDidMount() {
    this.props.getMemberships(this.club.id)
  }

  leaveClub = () => {
    this.props.leaveClub(this.club.id, this.props.navigation.goBack)
  }

  userForMembership (membership) {
    return this.props.users.filter((u) => u.id === membership.user_id)[0] || {email: 'loading...'}
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
          onPress={() => this.props.navigation.navigate('EditClub', {clubInfo: this.club})}
        />
      )
    }
  }

  render() {
    return (
      <View style={{
        width: '100%',
        height: '100%'
      }}>
        <View style={{height: '90%'}}>
          {this.renderMemberships()}
        </View>
        <Footer>
          <View style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}>
            <Button title="Leave Club"
              onPress={() => {
                confirmMessage(
                  'Leave Club',
                  'Are you sure? This action is permanent.',
                  this.leaveClub
                )
              }}
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
  const users = Object.values(state.users)
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
