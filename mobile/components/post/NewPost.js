import React, { PureComponent } from 'react'
import {
  ScrollView,
  StyleSheet,
  View
} from 'react-native'
import { compose } from 'redux'
import { connect } from 'react-redux'
import merge from 'lodash/fp/merge'

import { spacing } from '../styleConstants'

import { validatePresence } from '../../lib/validations'
import withValidation from '../helpers/withValidation'

import ActionButton from '../ui/ActionButton'
import BasicTextInput from '../ui/BasicTextInput'
import ModalSelector from '../ui/ModalSelector'

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
//   VALIDATIONS
// ===============

const validations = {
  title: validatePresence('you must have a title'),
  channel: validatePresence('you must select a channel')
}

// ===============
//    PRESENTER
// ===============

class NewPost extends PureComponent {

  // lifecycle

	constructor(props){
		super(props)
    this.state = merge(
      defaultState,
      {postInfo: {channel: this.givenChannel().id}}
    )
  }

  // helpers

  get channels () {
    return Object.values(this.props.channels)
  }

	channelData() {
		return this.channels.map(
      (chan) => {
        const club = this.props.clubs[chan.club_id]
        const label = (!club || Object.keys(this.props.clubs).length === 1)
          ? chan.name
          : `${chan.name} (${club.name})`
        return { key: chan.id, label }
      }
    )
  }

  givenChannel () {
    return this.props.navigation.state.params.channel || {}
  }

  // actions

  onPostClick = () => {
    this.props.unlessErrors(
      {channel: this.state.postInfo.channel, title: this.state.postInfo.title},
      this.createNewPost
    )
  }

	createNewPost = () => {
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
    this.props.hideErrors()
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
            onChange={(option)=> this.setPostState({channel: option.key})}
            error={this.props.errorFor('channel', this.state.postInfo.channel)}
          />
          <EditPostInfo
            errorFor={this.props.errorFor}
            setPostState={this.setPostState}
            postInfo={this.state.postInfo}
          />
          <BasicTextInput
            multiline
            height={40}
            label="first chat message"
            value={this.state.postInfo.message}
            onChangeText={(message) => this.setPostState({message})}
          />
          <ActionButton onPress={this.onPostClick}>
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
    channels: state.channels,
    clubs: state.clubs
  }
}

const dispatchableActions = {
  createPost,
  getChannels,
  getClubs
}

export default compose(
  withValidation(validations),
  connect(mapStateToProps, dispatchableActions)
)(NewPost)
