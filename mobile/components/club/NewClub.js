import React, { Component } from 'react'

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import ActionButton from '../ui/ActionButton'

import { connect } from 'react-redux'
import { createClub } from '../../data/clubs'

import EditClubInfo from './EditClubInfo'

const defaultClubInfo = { name: '', description: ''}
const defaultState = {
  showErrors: false,
  clubInfo: defaultClubInfo
}

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
      <View style={styles.root}>
        <ScrollView>
          <Text style={styles.header}> Create New Club: </Text>
          <EditClubInfo
            setClubState={this.setClubState}
            clubInfo={this.state.clubInfo}
          />
          <ActionButton onPress={this.onPost} >
            create club
          </ActionButton>
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
