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

import {
  validatePresence,
  validateLength,
  combineValidations
} from '../../lib/validations'
import withValidation from '../helpers/withValidation'

// ===============
//   VALIDATIONS
// ===============

const validations = {
  name: combineValidations(
    validatePresence('you must have a name'),
    validateLength({min: 1, max: 60, msg: 'must be between 1 and 60 characters'})
  ),
  description: validateLength({ max: 250, msg: 'must be under 250 characters'})
}

// ===============
//     STYLES
// ===============

const styles = StyleSheet.create({
  root: {
    padding: spacing.container
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
