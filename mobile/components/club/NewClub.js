import React, { Component } from 'react'

import {
  View,
  ScrollView,
  Text
} from 'react-native'

import BasicButton from '../ui/BasicButton'

import { connect } from 'react-redux'
import { createClub } from '../../data/clubs'

import EditClubInfo from './EditClubInfo'

const defaultClubInfo = { name: '', description: ''}
const defaultState = {
  showErrors: false,
  clubInfo: defaultClubInfo
}

// ===============
//    PRESENTER
// ===============

class NewClub extends Component {
  constructor(props){
    super(props)
    this.state = defaultState
  }

  onPost = () => {
    const {navigate, goBack} = this.props.navigation

    const onPostSuccess = (res) => {
      this.clearState()
      goBack()
      navigate('Club', {club: res.data})
    }

    this.props.createClub(this.state.clubInfo, onPostSuccess)
  }

  clearState = () => {
    this.setState(defaultState)
  }

  setClubState = (newKV) => {
    const clubInfo = Object.assign({}, this.state.clubInfo, newKV)
    this.setState({clubInfo})
  }

  render() {
    return (
      <View style={{padding: 50}}>
        <ScrollView>
          <Text style={{fontSize: 16}}> Create new club: </Text>
          <EditClubInfo
            setClubState={this.setClubState}
            clubInfo={this.state.clubInfo}
          />
          <BasicButton onPress={this.onPost} >
            create club
          </BasicButton>
        </ScrollView>
      </View>
    )
  }
}

// ===============
//   CONNECTION
// ===============

export default connect(
  null, 
  { createClub }
)(NewClub)
