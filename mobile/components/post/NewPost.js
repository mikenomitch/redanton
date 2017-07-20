import React from 'react'

import {
	Text,
	View,
	Button,
	Picker
} from 'react-native'

import {
	get,
	post
} from '../../lib/fetcher'

import EditPostInfo from './EditPostInfo'

const defaultPostInfo = {
	url: '',
	title: '',
	description: '',
	channel: '',
	showErrors: false,
}

class NewPost extends React.Component {
	constructor(props){
		super(props)

		this.state = {
			showErrors: false,
			postInfo: defaultPostInfo,
			channels: []
		}
	}

	componentDidMount () {
		get('/channels').then((res) => {
			this.setState({channels: res.data})
		})
	}

	onPost = () => {
		const {navigate, goBack} = this.props.navigation

		post(`/channels/${this.state.postInfo.channel}/posts`, {
			post: {
				title: this.state.postInfo.title,
				description: this.state.postInfo.description,
				url: this.state.postInfo.url
			}
		}).then((res) => {
			this.clearState()
			// TODO: Make this cleaner
			goBack()
			navigate('Post', {post: res.data})
		}).catch(() => alert('there was an error. check your inputs'))
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
		return this.state.channels.map((chan) => <Picker.Item label={chan.name} value={chan.id} key={chan.id} />)
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

export default NewPost
