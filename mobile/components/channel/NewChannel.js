import React, { Component } from 'react'

import {
	View,
  ScrollView,
  StyleSheet,
  Text
} from 'react-native'

import ModalSelector from 'react-native-modal-selector'
import BasicButton from '../ui/BasicButton'

import { connect } from 'react-redux'
import { createChannel } from '../../data/channels'

import EditChannelInfo from './EditChannelInfo'

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
    padding: '50%'
  },
  header: {
    fontSize: 16
  },
  footerContent: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
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
      <View style={styles.root}>
        <ScrollView>
          <Text style={styles.header}> Create a channel: </Text>
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
          <BasicButton onPress={this.onPost} >
            make channel
          </BasicButton>
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

export default connect(
  mapStateToProps,
  { createChannel }
)(NewChannel)
