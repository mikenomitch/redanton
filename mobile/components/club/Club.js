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
  kickMember
} from '../../data/memberships'

import Footer from '../ui/Footer'

// ===============
//    CHILDREN
// ===============

const Membership = (props) => (
  <View
    key={props.membership.id}
    style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center'
    }}
  >
    <View key="info">
      <Text> Membership for: {props.user.name} </Text>
    </View>

    <View key="elevate">
      <Button title="make admin" onPress={() => alert('yay admin')}/>
    </View>

    <View key="kick">
      <Button title="kick from club" onPress={() => confirmMessage(
        'Kick User',
        'Are you sure? This action is permanent.',
        props.kickMember
      )} />
    </View>
  </View>
)

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

  renderMemberships () {
    return this.props.memberships.map((membership) => (
      <Membership
        key={membership.user_id}
        membership={membership}
        kickMember={this.kickMemberCall(membership.id)}
        user={this.userForMembership(membership)}
      />
    ))
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
            <Button title="Edit Club"
              onPress={() => this.props.navigation.navigate('EditClub', {clubInfo: this.club})}
            />
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

  return { memberships, users }
}

export default connect(
  mapStateToProps, {
    getMemberships,
    leaveClub,
    kickMember
  }
)(Club)
