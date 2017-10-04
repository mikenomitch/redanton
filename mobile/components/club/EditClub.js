import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { spacing } from '../styleConstants'

import { updateClub } from '../../data/clubs'

import ActionButton from '../ui/ActionButton'
import EditClubInfo from './EditClubInfo'

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

class EditClub extends Component {
	constructor(props){
		super(props)

		this.state = {
			showErrors: false,
			clubInfo: this.props.navigation.state.params.clubInfo,
		}
	}

	updateClub = () => {
		const {goBack} = this.props.navigation
    this.props.updateClub(this.state.clubInfo, () => goBack())
  }

  onUpdateClubClick = () => {
    this.props.unlessErrors(
      {name: this.state.clubInfo.name, description: this.state.clubInfo.description},
      this.updateClub
    )
  }

	setClubState = (newKV) => {
		const clubInfo = Object.assign({}, this.state.clubInfo, newKV)
		this.setState({clubInfo})
	}

  render() {
    return (
			<View style={{padding: spacing.container}}>
        <EditClubInfo
          setClubState={this.setClubState}
          clubInfo={this.state.clubInfo}
          errorFor={this.props.errorFor}
        />
				<ActionButton onPress={this.onUpdateClubClick} >
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
  connect(null, { updateClub })
)(EditClub)
