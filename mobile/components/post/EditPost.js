import React from 'react'

import {
	View,
	Button,
	Text
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { updatePost } from '../../data/posts'

import EditPostInfo from './EditPostInfo'

class EditPost extends React.Component {
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
				<Button onPress={this.onSave} title="save edits" />
			</View>
		)
  }
}

const mapDispatchToProps = (dispatch) => {
  return	{
    updatePost: bindActionCreators(updatePost, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(EditPost)
