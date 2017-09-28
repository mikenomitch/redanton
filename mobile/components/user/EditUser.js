import React, { Component } from 'react'
import { View, Text } from 'react-native'

import BasicButton from '../ui/BasicButton'

import { connect } from 'react-redux'

import { updateSelf } from '../../data/users'

import EditUserInfo from './EditUserInfo'

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
      <View style={{paddingTop: 0, paddingLeft: 50, paddingRight: 50}}>
        <Text> email: {this.state.userInfo.email} </Text>
        <EditUserInfo userInfo={this.state.userInfo} changeUserInfo={this.changeUserInfo} />
        <BasicButton onPress={this.saveChanges}>
          save changes
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
  { updateSelf }
)(EditUser)
