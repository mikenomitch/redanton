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

import { validatePresence } from '../../lib/validations'
import withValidation from '../helpers/withValidation'

// ===============
//   VALIDATIONS
// ===============

const validations = {
  name: validatePresence('you must have a name'),
  club: validatePresence('you must select a club')
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
  header: {
    fontSize: font.medium
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
		return this.props.clubs.map(
      (club) => ({ key: club.id, label: club.name })
    )
	}

	createNewChannel = () => {
    const {navigate, goBack} = this.props.navigation

    const onPostSuccess = (res) => {
      this.clearState()
			goBack()
			navigate('Channel', {channel: res.data})
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
          <Text style={styles.header}>
            Create a channel:
          </Text>
          <ModalSelector
            style={styles.modalSelector}
            data={this.clubData()}
            initValue="select club"
            onChange={this.onModalChange}
            error={this.props.errorFor('club', this.state.clubId)}
          />
          <EditChannelInfo
            errorFor={this.props.errorFor}
            setChannelState={this.setChannelState}
            channelInfo={this.state.channelInfo}
          />
          <ActionButton onPress={this.onMakeChannelClick} >
            make channel
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
  const clubs = Object.values(state.clubs)
  return {clubs}
}

export default compose(
  withValidation(validations),
  connect(mapStateToProps, { createChannel })
)(NewChannel)
