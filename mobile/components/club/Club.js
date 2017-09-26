import React, {Component} from 'react'

import {
  Button,
  View
} from 'react-native'

import { connect } from 'react-redux'

import { getMemberships } from '../../data/memberships'
import Footer from '../ui/Footer'

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

  render() {
    return (
      <View style={{
        width: '100%',
        height: '100%'
      }}>
        <View style={{height: '90%'}}>
          {this.props.memberships.map((m) => (
            <Text> User: {m.user_id} </Text>
          ))}
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
              onPress={() => alert('Not yet!')}
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
  const clubId = props.navigation.state.params.club.id
  const memberships = Object.values(state.memberships).filter(
    (m) => m.club_id === clubId
  )

  return { memberships }
}

export default connect(
  mapStateToProps, { getMemberships }
)(Club)
