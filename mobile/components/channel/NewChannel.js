import React, { Component } from 'react'
import {
	View,
  ScrollView,
  StyleSheet,
  Text
} from 'react-native'
import ModalSelector from 'react-native-modal-selector'
import { connect } from 'react-redux'

import { spacing, font } from '../styleConstants'

import { createChannel } from '../../data/channels'

import ActionButton from '../ui/ActionButton'
import EditChannelInfo from './EditChannelInfo'

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

class NewChannel extends Component {
	constructor(props){
		super(props)
		this.state = defaultState
  }

  clubData() {
		return this.props.clubs.map(
      (club) => ({ key: club.id, label: club.name })
    )
	}

	onPost = () => {
    const {navigate, goBack} = this.props.navigation

    const onPostSuccess = (res) => {
      this.clearState()
			goBack()
			navigate('Channel', {channel: res.data})
    }

    this.props.createChannel(this.state.clubId, this.state.channelInfo, onPostSuccess)
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
      <ScrollView style={styles.root}>
        <Text style={styles.header}>
          Create a channel:
        </Text>
        <ModalSelector
          style={styles.modalSelector}
          data={this.clubData()}
          initValue="select club"
          onChange={this.onModalChange}
        />
        <EditChannelInfo
          setChannelState={this.setChannelState}
          channelInfo={this.state.channelInfo}
        />
        <ActionButton onPress={this.onPost} >
          make channel
        </ActionButton>
      </ScrollView>
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

export default connect(
  mapStateToProps,
  { createChannel }
)(NewChannel)
