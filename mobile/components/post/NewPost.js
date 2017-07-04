import React from 'react'
import { Text, View, Link, TextInput, Button } from 'react-native'

import { post } from '../../lib/fetcher'

const defaultState = {
	url: '',
	title: '',
	description: '',
	channel: '',
	showErrors: false,
}

class NewPost extends React.Component {
	constructor(props){
		super(props)
		this.state = defaultState
	}

	onPost = () => {
		const {navigate} = this.props.navigation

		post(`/channels/${this.state.channel}/posts`, {
			post: {
				title: this.state.title,
				description: this.state.description,
				url: this.state.url
			}
		}).then((res) => {
			this.clearState()
			navigate('Post', {post: res.data})
		}).catch(() => alert('there was an error. check your inputs'))
	}

	clearState = () => {
		this.setState(defaultState)
	}

  render() {
    return (
			<View style={{padding: 50}}>
				<TextInput
          style={{height: 60, fontSize: 18}}
          placeholder="url"
					keyboardType="url"
					autoCapitalize="none"
					value={this.state.url}
          onChangeText={(url) => this.setState({url})}
        />

				<TextInput
          style={{height: 60, fontSize: 18}}
          placeholder="title"
					value={this.state.title}
          onChangeText={(title) => this.setState({title})}
        />

				<TextInput
          style={{height: 60, fontSize: 18}}
          placeholder="description"
					multiline={true}
					numberOfLines={5}
					value={this.state.description}
          onChangeText={(description) => this.setState({description})}
        />

				<TextInput
          style={{height: 60, fontSize: 18}}
          placeholder="channel id"
					value={this.state.channel}
					keyboardType="numeric"
          onChangeText={(channel) => this.setState({channel})}
        />

				<Button
					onPress={this.onPost}
					title="post it"
				/>
			</View>
		)
  }
}

export default NewPost
