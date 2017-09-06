import React, { Component } from 'react'

import {
	Button,
	View,
  ScrollView,
  Text,
  TextInput
} from 'react-native'

import { connect } from 'react-redux'
import { createChannel } from '../../data/channels'

import EditChannelInfo from './EditChannelInfo'

const defaultChannelInfo = { name: ''}
const defaultState = {
  showErrors: false,
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

    this.props.createChannel(this.state.channelInfo, onPostSuccess)
	}

	clearState = () => {
		this.setState(defaultState)
	}

	setChannelState = (newKV) => {
		const channelInfo = Object.assign({}, this.state.channelInfo, newKV)
		this.setState({channelInfo})
	}

  render() {
    return (
      <View style={{padding: 50}}>
        <ScrollView>
          <Text style={{fontSize: 16}}> Create a channel: </Text>
          <EditChannelInfo
            setChannelState={this.setChannelState}
            channelInfo={this.state.channelInfo}
          />
          <Button
            onPress={this.onPost}
            title="make it"
          />
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
  { createChannel }
)(NewChannel)
