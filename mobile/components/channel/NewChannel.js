import React, { Component } from 'react'

import {
	View,
  ScrollView,
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

// ===============
//    PRESENTER
// ===============

class NewChannel extends Component {
	constructor(props){
		super(props)
		this.state = defaultState
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

  clubData() {
		return this.props.clubs.map(
      (club) => ({ key: club.id, label: club.name })
    )
	}

  render() {
    return (
      <View style={{padding: 50}}>
        <ScrollView>
          <Text style={{fontSize: 16}}> Create a channel: </Text>
          <ModalSelector
            style={{borderRadius: 0}}
            data={this.clubData()}
            initValue="select club"
            onChange={(option)=> this.setState({clubId: option.key}) } />
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
