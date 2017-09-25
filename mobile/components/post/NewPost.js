import React, { Component } from 'react'

import {
	Button,
	Picker,
	View,
  ScrollView,
  Text,
  TextInput
} from 'react-native'

import ModalPicker from 'react-native-modal-picker'
import { Hoshi } from 'react-native-textinput-effects'

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

	channelData() {
		return this.props.channels.map(
      (chan) => ({ key: chan.id, label: chan.name })
    )
	}

  // <Picker
  //   selectedValue={this.state.postInfo.channel}
  //   onValueChange={(channel) => this.setPostState({channel})}>
  //   {this.renderChannels()}
  // </Picker>
  render() {
    return (
      <View style={{padding: 50}}>
        <ScrollView>
          <ModalPicker
            data={this.channelData()}
            initValue="select channel"
            onChange={(option)=> {return true}} />
          <EditPostInfo setPostState={this.setPostState} postInfo={this.state.postInfo} />
          <Hoshi
            style={{paddingTop: 5}}
            label="start the discussion"
            backgroundColor={'transparent'}
            labelStyle={{ color: 'black' }}
            borderColor={'black'}

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
