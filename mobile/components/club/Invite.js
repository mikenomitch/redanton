import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'

import { createMembership } from '../../data/memberships'

import BasicTextInput from '../ui/BasicTextInput'
import ActionButton from '../ui/ActionButton'

// ===============
//     STYLES
// ===============

const styles = StyleSheet.create({
  root: {
    padding: 50
  },
  header: {
    fontSize: 16
  }
})

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
      <View style={styles.root}>
        <Text style={styles.header}> Invite Member: </Text>
        <BasicTextInput
          label="email"
          value={this.state.email}
          onChangeText={this.setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <ActionButton onPress={this.sendInvite} >
          send invite
        </ActionButton>
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
