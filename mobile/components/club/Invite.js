import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'

import { createMembership } from '../../data/memberships'

import BasicTextInput from '../ui/BasicTextInput'
import BasicButton from '../ui/BasicButton'

// ===============
//    PRESENTER
// ===============

const defaultState = {email: "" }
class Invite extends Component {
  constructor(props){
    super(props)
    this.state = defaultState
  }

  clearState = () => {
    this.setState(defaultState)
  }

  setEmail = (email) => {
    this.setState({email})
  }

  sendInvite = () => {
    const onPostSuccess = (res) => {
      this.clearState()
      this.props.navigation.goBack()
    }

    this.props.createMembership(
      this.props.navigation.state.params.clubId,
      this.state.email,
      onPostSuccess
    )
  }

  render() {
    return (
      <View style={{padding: 50}}>
        <Text style={{fontSize: 16}}> Invite Member: </Text>
        <BasicTextInput
          label="email"
          value={this.state.email}
          onChangeText={this.setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <BasicButton onPress={this.sendInvite} >
          send invite
        </BasicButton>
      </View>
    )
  }
}

// ===============
//   CONNECTION
// ===============

export default connect(
  null,
  { createMembership }
)(Invite)
