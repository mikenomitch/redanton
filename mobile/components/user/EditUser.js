import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { font, spacing } from '../styleConstants'

import { updateSelf } from '../../data/users'

import ActionButton from '../ui/ActionButton'

import { validatePresence } from '../../lib/validations'
import withValidation from '../helpers/withValidation'

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
//   VALIDATIONS
// ===============
const validations = {
  name: validatePresence('must provide a name')
}

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

  onSaveClick = () => {
    this.props.unlessErrors(
      { name: this.state.userInfo.name },
      this.saveChanges
    )
  }

  render() {
    return (
      <View style={styles.root}>
        <Text style={styles.attributeLabel} > Email: </Text>
        <Text style={styles.attribute} > {this.state.userInfo.email} </Text>
        <EditUserInfo
          errorFor={this.props.errorFor}
          userInfo={this.state.userInfo}
          changeUserInfo={this.changeUserInfo}
        />
        <ActionButton onPress={this.onSaveClick}>
          save changes
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
  connect(null, { updateSelf })
)(EditUser)