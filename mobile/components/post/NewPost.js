import React from 'react'

import {
	Text,
	View,
	Link,
	TextInput,
	Button,
	Picker
} from 'react-native'

import {
	get,
	post
} from '../../lib/fetcher'

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
		const {navigate} = this.props.navigation

		post(`/channels/${this.state.postInfo.channel}/posts`, {
			post: {
				title: this.state.postInfo.title,
				description: this.state.postInfo.description,
				url: this.state.postInfo.url
			}
		}).then((res) => {
			this.clearState()
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
				<TextInput
          style={{height: 60, fontSize: 18}}
          placeholder="url"
					keyboardType="url"
					autoCapitalize="none"
					value={this.state.postInfo.url}
          onChangeText={(url) => this.setPostState({url})}
        />

				<TextInput
          style={{height: 60, fontSize: 18}}
          placeholder="title"
					value={this.state.postInfo.title}
          onChangeText={(title) => this.setPostState({title})}
        />

				<TextInput
          style={{height: 60, fontSize: 18}}
          placeholder="description"
					multiline={true}
					numberOfLines={5}
					value={this.state.postInfo.description}
          onChangeText={(description) => this.setPostState({description})}
        />

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
