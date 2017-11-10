import React, { PureComponent } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { font, spacing } from '../styleConstants'

import ActionButton from '../ui/ActionButton'
import { createClub } from '../../data/clubs'

import EditClubInfo from './EditClubInfo'

import { validatePresence } from '../../lib/validations'
import withValidation from '../helpers/withValidation'

// ===============
//   VALIDATIONS
// ===============

const validations = {
  name: validatePresence('you must have a name')
}

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
//    PRESENTER
// ===============

const defaultClubInfo = { name: '', description: ''}
const defaultState = {
  clubInfo: defaultClubInfo
}


class NewClub extends PureComponent {
  constructor(props){
    super(props)
    this.state = defaultState
  }

  createClub = () => {
    const {navigate, goBack} = this.props.navigation

    const onPostSuccess = (res) => {
      this.clearState()
      goBack()
      navigate('Club', {club: res.data})
    }

    this.props.createClub(this.state.clubInfo, onPostSuccess)
  }

  onCreateClubClick = () => {
    this.props.unlessErrors(
      {name: this.state.clubInfo.name, description: this.state.clubInfo.description},
      this.createClub
    )
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
            errorFor={this.props.errorFor}
          />
          <ActionButton onPress={this.onCreateClubClick} >
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

export default compose(
  withValidation(validations),
  connect(null, { createClub })
)(NewClub)
