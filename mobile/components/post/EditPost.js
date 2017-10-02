import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import { updatePost } from '../../data/posts'

import ActionButton from '../ui/ActionButton'
import EditPostInfo from './EditPostInfo'

// ===============
//    PRESENTER
// ===============

class EditPost extends Component {
	constructor(props){
		super(props)

		this.state = {
			showErrors: false,
			postInfo: this.props.navigation.state.params.postInfo,
		}
	}

	onSave = () => {
		const {goBack} = this.props.navigation
    this.props.updatePost(this.state.postInfo, () => goBack())
	}

	setPostState = (newKV) => {
		const postInfo = Object.assign({}, this.state.postInfo, newKV)
		this.setState({postInfo})
	}

  render() {
    return (
			<View style={{padding: 50}}>
				<EditPostInfo setPostState={this.setPostState} postInfo={this.state.postInfo} />
				<ActionButton onPress={this.onSave}>
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
  { updatePost }
)(EditPost)
