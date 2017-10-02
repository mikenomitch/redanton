import React, { Component } from 'react'
import { View } from 'react-native'

import { connect } from 'react-redux'

import { updateClub } from '../../data/clubs'

import ActionButton from '../ui/ActionButton'
import EditClubInfo from './EditClubInfo'

// ===============
//    PRESENTER
// ===============

class EditClub extends Component {
	constructor(props){
		super(props)

		this.state = {
			showErrors: false,
			clubInfo: this.props.navigation.state.params.clubInfo,
		}
	}

	onSave = () => {
		const {goBack} = this.props.navigation
    this.props.updateClub(this.state.clubInfo, () => goBack())
	}

	setClubState = (newKV) => {
		const clubInfo = Object.assign({}, this.state.clubInfo, newKV)
		this.setState({clubInfo})
	}

  render() {
    return (
			<View style={{padding: 50}}>
				<EditClubInfo setClubState={this.setClubState} clubInfo={this.state.clubInfo} />
				<ActionButton onPress={this.onSave} >
					save edits
				</ActionButton>
			</View>
		)
  }
}

// ===============
//   CONNECTION
// ===============

export default connect(
  null,
  { updateClub }
)(EditClub)
