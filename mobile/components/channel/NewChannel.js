import React, { PureComponent } from 'react'
import {
	View,
  ScrollView,
  StyleSheet,
  Text
} from 'react-native'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { spacing, font } from '../styleConstants'

import { createChannel } from '../../data/channels'

import ActionButton from '../ui/ActionButton'
import EditChannelInfo from './EditChannelInfo'
import ModalSelector from '../ui/ModalSelector'

import withValidation from '../helpers/withValidation'
import {
  validatePresence,
  validateLength,
  combineValidations
} from '../../lib/validations'

// ===============
//   VALIDATIONS
// ===============

const validations = {
  name: combineValidations(
    validatePresence('you must have a name'),
    validateLength({min: 1, max: 60, msg: 'must be between 1 and 60 characters'})
  ),
  club: validatePresence('you must select a club'),
  description: validateLength({ max: 250, msg: 'must be under 250 characters'})
}

// =============
//   DEFAULTS
// =============

const defaultChannelInfo = { name: '', description: ''}
const defaultState = {
  showErrors: false,
  clubId: null,
  channelInfo: defaultChannelInfo
}

// ============
//    STYLES
// ============

const styles = StyleSheet.create({
  root: {
    height: '100%',
    width: '100%',
    padding: spacing.container,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalSelector: {
    borderRadius: 0
  },
})

// ===============
//    PRESENTER
// ===============

class NewChannel extends PureComponent {
	constructor(props){
		super(props)
		this.state = defaultState
  }

  clubData() {
		return Object.values(this.props.clubs).map(
      (club) => ({ key: club.id, label: club.name })
    )
  }

  givenClub () {
    return this.props.clubs[this.props.navigation.state.params.clubId] || {}
  }

	createNewChannel = () => {
    const {navigate, goBack} = this.props.navigation

    const onPostSuccess = (res) => {
      this.clearState()
			goBack()
			navigate('Tag', {channel: res.data})
    }

    this.props.createChannel(
      this.state.clubId,
      this.state.channelInfo,
      onPostSuccess
    )
  }

  onMakeChannelClick = () => {
    this.props.unlessErrors(
      {
        club: this.state.clubId,
        description: this.state.channelInfo.description,
        name: this.state.channelInfo.name
      },
      this.createNewChannel
    )
  }

	clearState = () => {
		this.setState(defaultState)
	}

	setChannelState = (newKV) => {
		const channelInfo = Object.assign({}, this.state.channelInfo, newKV)
		this.setState({channelInfo})
  }

  onModalChange = (option) => {
    this.setState({clubId: option.key})
  }

  render() {
    return (
      <View style={styles.root}>
        <ScrollView>
          <ModalSelector
            style={styles.modalSelector}
            data={this.clubData()}
            initValue={this.givenClub().name || "select club"}
            onChange={this.onModalChange}
            error={this.props.errorFor('club', this.state.clubId)}
          />
          <EditChannelInfo
            errorFor={this.props.errorFor}
            setChannelState={this.setChannelState}
            channelInfo={this.state.channelInfo}
          />
          <ActionButton onPress={this.onMakeChannelClick} >
            add tag
          </ActionButton>
        </ScrollView>
      </View>
		)
  }
}

// ===============
//   CONNECTION
// ===============

const mapStateToProps = (state) => {
  return {clubs: state.clubs}
}

export default compose(
  withValidation(validations),
  connect(mapStateToProps, { createChannel })
)(NewChannel)
