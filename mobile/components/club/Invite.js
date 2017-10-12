import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native'
import { compose } from 'redux'
import { connect } from 'react-redux'

import { font, spacing } from '../styleConstants'

import { createMembership } from '../../data/memberships'

import BasicTextInput from '../ui/BasicTextInput'
import ActionButton from '../ui/ActionButton'

import { validateEmail } from '../../lib/validations'
import withValidation from '../helpers/withValidation'

// ===============
//     STYLES
// ===============

const styles = StyleSheet.create({
  root: {
    padding: spacing.container
  },
  header: {
    fontSize: font.medium
  }
})

// ===============
//   VALIDATIONS
// ===============

const validations = {
  email: validateEmail('email not valid')
}

// ===============
//    PRESENTER
// ===============

const defaultState = {email: "" }
class Invite extends PureComponent {
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

  onSendInviteClick = () => {
    this.props.unlessErrors(
      {email: this.state.email},
      this.sendInvite
    )
  }

  render() {
    return (
      <View style={styles.root}>
        <Text style={styles.header}>
          Invite Member:
        </Text>
        <BasicTextInput
          label="email"
          value={this.state.email}
          onChangeText={this.setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          error={this.props.errorFor('email', this.state.email)}
        />
        <ActionButton onPress={this.onSendInviteClick} >
          send invite
        </ActionButton>
      </View>
    )
  }
}

// ===============
//   CONNECTION
// ===============

export default compose(
  withValidation(validations),
  connect(null, { createMembership })
)(Invite)
