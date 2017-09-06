import React, { Component } from 'react'

import {
	Button,
	Picker,
	View,
  ScrollView,
  Text,
  TextInput
} from 'react-native'

import { connect } from 'react-redux'

import { getChannels } from '../../data/channels'
import { createPost } from '../../data/posts'

import EditPostInfo from './EditPostInfo'

const defaultPostInfo = {
	url: '',
	title: '',
	description: '',
	channel: ''
}

const defaultState = {
  showErrors: false,
  postInfo: defaultPostInfo
}

// ===============
//    PRESENTER
// ===============

class NewPost extends Component {
	constructor(props){
		super(props)
		this.state = defaultState
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
		this.setState(defaultState)
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
        <ScrollView>
          <Text style={{fontSize: 16}}> Post to channel: </Text>
          <Picker
            selectedValue={this.state.postInfo.channel}
            onValueChange={(channel) => this.setPostState({channel})}>
            {this.renderChannels()}
          </Picker>
          <EditPostInfo setPostState={this.setPostState} postInfo={this.state.postInfo} />
          <Text> message: </Text>
          <TextInput
            style={{height: 60, fontSize: 18}}
            placeholder="start the discussion"
            value={this.state.postInfo.message}
            returnKeyType="next"
            onChangeText={(message) => this.setPostState({message})}
          />
          <Button
            onPress={this.onPost}
            title="post it"
          />
        </ScrollView>
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

export default connect(
  mapStateToProps,
  { createPost, getChannels }
)(NewPost)
