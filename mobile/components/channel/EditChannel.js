import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { updateChannel } from '../../data/channels'

import ActionButton from '../ui/ActionButton'
import EditChannelInfo from './EditChannelInfo'

import { validatePresence } from '../../lib/validations'
import withValidation from '../helpers/withValidation'

// ===============
//   VALIDATIONS
// ===============

const validations = {
  description: validatePresence('you must have a description'),
  name: validatePresence('you must have a name')
}

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

	updateChannel = () => {
		const {goBack} = this.props.navigation
    this.props.updateChannel(this.state.channelInfo, () => goBack())
  }

  onUpdateChannelClick = () => {
    this.props.unlessErrors(
      {name: this.state.channelInfo.name},
      this.updateChannel
    )
  }

	setChannelState = (newKV) => {
		const channelInfo = Object.assign({}, this.state.channelInfo, newKV)
		this.setState({channelInfo})
	}

  render() {
    return (
			<View style={{padding: 50}}>
        <EditChannelInfo
          setChannelState={this.setChannelState}
          channelInfo={this.state.channelInfo}
          errorFor={this.props.errorFor}
        />
				<ActionButton onPress={this.onUpdateChannelClick} >
					save edits
				</ActionButton>
			</View>
		)
  }
}

// ===============
//   CONNECTION
// ===============

export default compose(
  withValidation(validations),
  connect(null, { updateChannel })
)(EditChannel)
