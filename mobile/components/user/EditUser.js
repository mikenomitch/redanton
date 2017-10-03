import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'

import { font, spacing } from '../styleConstants'

import { updateSelf } from '../../data/users'

import ActionButton from '../ui/ActionButton'

import EditUserInfo from './EditUserInfo'

// ===============
//     STYLES
// ===============

const styles = StyleSheet.create({
  root: {
    paddingTop: 0,
    paddingLeft: spacing.container,
    paddingRight: spacing.container
  },
  attributeLabel: {
    marginTop: spacing.medium,
    fontWeight: font.heavyWeight,
    fontSize: font.medium
  },
  attribute: {
    fontWeight: font.lightWeight,
    fontSize: font.medium
  },
})

// ===============
//    PRESENTER
// ===============

class EditUser extends Component {
  constructor(props){
    super(props)

    this.state = {
      userInfo: this.props.navigation.state.params.userInfo,
    }
  }

  changeUserInfo = (newKV) => {
    const userInfo = Object.assign({}, this.state.userInfo, newKV)
		this.setState({userInfo})
  }

  saveChanges = () => {
    this.props.updateSelf(
      this.state.userInfo,
      () => { alert('user info updated') }
    )
  }

  render() {
    const {email, password, passwordConfirmation, name} = this.state

    return (
      <View style={styles.root}>
        <Text style={styles.attributeLabel} > Email: </Text>
        <Text style={styles.attribute} > {this.state.userInfo.email} </Text>
        <EditUserInfo userInfo={this.state.userInfo} changeUserInfo={this.changeUserInfo} />
        <ActionButton onPress={this.saveChanges}>
          save changes
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
  { updateSelf }
)(EditUser)
