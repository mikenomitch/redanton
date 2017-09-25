import React, { Component } from 'react'
import { View } from 'react-native'

import { connect } from 'react-redux'

import { updateChannel } from '../../data/channels'

import BasicButton from '../ui/BasicButton'
import EditChannelInfo from './EditChannelInfo'

// ===============
//    PRESENTER
// ===============

class EditChannel extends Component {
	constructor(props){
		super(props)

		this.state = {
			showErrors: false,
			channelInfo: this.props.navigation.state.params.channelInfo,
		}
	}

	onSave = () => {
		const {goBack} = this.props.navigation
    this.props.updateChannel(this.state.channelInfo, () => goBack())
	}

	setChannelState = (newKV) => {
		const channelInfo = Object.assign({}, this.state.channelInfo, newKV)
		this.setState({channelInfo})
	}

  render() {
    return (
			<View style={{padding: 50}}>
				<EditChannelInfo setChannelState={this.setChannelState} channelInfo={this.state.channelInfo} />
				<BasicButton onPress={this.onSave} >
					save edits
				</BasicButton>
			</View>
		)
  }
}

// ===============
//   CONNECTION
// ===============

export default connect(
  null,
  { updateChannel }
)(EditChannel)
