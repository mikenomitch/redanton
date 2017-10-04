import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import { spacing } from '../styleConstants'

import { deletePost, updatePost } from '../../data/posts'

import ActionButton from '../ui/ActionButton'
import EditPostInfo from './EditPostInfo'
import DeletePostButton from './DeletePostButton'

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

  removePost = () => {
    this.props.deletePost(this.state.postInfo.id, this.props.navigation.goBack)
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
			<View style={{padding: spacing.container}}>
				<EditPostInfo setPostState={this.setPostState} postInfo={this.state.postInfo} />
				<ActionButton onPress={this.onSave}>
					save edits
        </ActionButton>
        <DeletePostButton removePost={this.removePost} />
			</View>
		)
  }
}

// ===============
//   CONNECTION
// ===============

export default connect(
  null,
  {
    deletePost,
    updatePost
   }
)(EditPost)
