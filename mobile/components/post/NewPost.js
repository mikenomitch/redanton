import React, { Component } from 'react'

import {
	Text,
	View,
	Button,
	Picker
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getChannels } from '../../data/channels'
import { createPost } from '../../data/posts'

import EditPostInfo from './EditPostInfo'

const defaultPostInfo = {
	url: '',
	title: '',
	description: '',
	channel: '',
	showErrors: false,
}

// ===============
//    PRESENTER
// ===============

class NewPost extends Component {
	constructor(props){
		super(props)

		this.state = {
			showErrors: false,
			postInfo: defaultPostInfo
		}
	}

	componentDidMount () {
		this.props.getChannels()
	}

	onPost = () => {
    const {navigate, goBack} = this.props.navigation

    const onPostSuccess = (res) => {
      this.clearState()
			goBack()
			navigate('Post', {post: res.data})
    }

    this.props.createPost(this.state.postInfo, onPostSuccess)
	}

	clearState = () => {
		this.setState({
			showErrors: false,
			postInfo: defaultPostInfo
		})
	}

	setPostState = (newKV) => {
		const postInfo = Object.assign({}, this.state.postInfo, newKV)
		this.setState({postInfo})
	}

	renderChannels() {
		return this.props.channels.map((chan) => <Picker.Item label={chan.name} value={chan.id} key={chan.id} />)
	}

  render() {
    return (
			<View style={{padding: 50}}>
				<EditPostInfo setPostState={this.setPostState} postInfo={this.state.postInfo} />

				<Picker
					selectedValue={this.state.postInfo.channel}
					onValueChange={(channel) => this.setPostState({channel})}>
					{this.renderChannels()}
				</Picker>

				<Button
					onPress={this.onPost}
					title="post it"
				/>
			</View>
		)
  }
}

// ===============
//   CONNECTION
// ===============

const mapStateToProps = (state) => {
  return {
    channels: Object.values(state.channels)
  }
}

const mapDispatchToProps = (dispatch) => {
  return	{
    createPost: bindActionCreators(createPost, dispatch),
    getChannels: bindActionCreators(getChannels, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPost)
