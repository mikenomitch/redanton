import React, { Component } from 'react'
import {
  ScrollView,
  StyleSheet,
  View
} from 'react-native'
import ModalSelector from 'react-native-modal-selector'
import { connect } from 'react-redux'
import merge from 'lodash/fp/merge'

import { spacing } from '../styleConstants'

import { validatePresence } from '../../lib/validations'

import BasicTextInput from '../ui/BasicTextInput'
import ActionButton from '../ui/ActionButton'

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
//     STYLES
// ===============

const styles = StyleSheet.create({
  root: {
    padding: spacing.container
  },
  modalSelector: {
    borderRadius: 0
  }
})

// ===============
//    PRESENTER
// ===============

class NewPost extends Component {

  // lifecycle

	constructor(props){
		super(props)
    this.state = merge(
      defaultState,
      {postInfo: {channel: this.givenChannel().id}}
    )
	}

	componentDidMount () {
    this.props.getChannels()
    this.props.getClubs()
  }

  // helpers

	channelData() {
		return this.props.channels.map(
      (chan) => ({ key: chan.id, label: chan.name })
    )
  }

  givenChannel () {
    return this.props.navigation.state.params.channel || {}
  }

  // errors

  errorFor = (field, value) => {
    return this.state.showErrors && this.checkError(field, value)
  }

  showErrors = () => {
    this.setState({showErrors: true})
  }

  hideErrors = () => {
    this.setState({showErrors: false})
  }

  checkError(field, value) {
    const validationForField = {
      title: validatePresence('you must have a title'),
      channel: validatePresence('you must have a channel')
    }[field]

    return validationForField && validationForField(value)
  }

  // actions

	onPost = () => {
    const {navigate, goBack} = this.props.navigation

    const onPostSuccess = (res) => {
      this.clearState()
			goBack()
    }

    this.props.createPost(this.state.postInfo, onPostSuccess)
	}

	setPostState = (newKV) => {
    const postInfo = Object.assign({}, this.state.postInfo, newKV)
		this.setState({postInfo})
	}

  clearState = () => {
    this.setState(defaultState)
  }

  // rendering

  render() {
    return (
      <View style={styles.root}>
        <ScrollView>
          <ModalSelector
            style={styles.modalSelector}
            data={this.channelData()}
            initValue={this.givenChannel().name || "select channel"}
            onChange={(option)=> this.setPostState({channel: option.key}) } />
          <EditPostInfo
            errorFor={this.errorFor}
            setPostState={this.setPostState}
            postInfo={this.state.postInfo}
          />
          <BasicTextInput
            label="first chat message"
            value={this.state.postInfo.message}
            onChangeText={(message) => this.setPostState({message})}
          />
          <ActionButton onPress={this.onPost}>
            post it
          </ActionButton>
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
