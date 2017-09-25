import React, { Component } from 'react'

import {
	View,
  ScrollView
} from 'react-native'

import ModalSelector from 'react-native-modal-selector'
import BasicTextInput from '../ui/BasicTextInput'
import BasicButton from '../ui/BasicButton'

import { connect } from 'react-redux'

import { getChannels } from '../../data/channels'
import { getClubs } from '../../data/clubs'
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
    this.props.getClubs()
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

	channelData() {
		return this.props.channels.map(
      (chan) => ({ key: chan.id, label: chan.name })
    )
	}

  render() {
    return (
      <View style={{padding: 50}}>
        <ScrollView>
          <ModalSelector
            style={{borderRadius: 0}}
            data={this.channelData()}
            initValue="select channel"
            onChange={(option)=> this.setPostState({channel: option.key}) } />
          <EditPostInfo setPostState={this.setPostState} postInfo={this.state.postInfo} />
          <BasicTextInput
            label="first message"
            value={this.state.postInfo.message}
            onChangeText={(message) => this.setPostState({message})}
          />
          <BasicButton onPress={this.onPost}>
            post it
          </BasicButton>
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
  { createPost, getChannels, getClubs }
)(NewPost)
