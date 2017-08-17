import React, { Component } from 'react'

import {
  Text,
  View
} from 'react-native'

import {
  Socket
} from "phoenix"

import flow from 'lodash/fp/flow'
import map from 'lodash/fp/map'
import reverse from 'lodash/fp/reverse'
import sortBy from 'lodash/fp/sortBy'

import {
  connect
} from 'react-redux'

import {
  GiftedChat
} from 'react-native-gifted-chat'

import { serverUrl } from '../../lib/serverInfo'

import {
  messageActions,
  getMessagesForPost
} from '../../data/messages'

import { getUsersForPost } from '../../data/users'

// ===============
//    PRESENTER
// ===============

function __postFromProps (props) {
  return props.navigation.state.params.post
}

class PostChat extends Component {

  // GENERAL HELPERS

  get post() {
    return __postFromProps(this.props)
  }

  formattedUser = (userId) => {
    const userInfo = this.props.users[userId] || {}
    return {
      _id: userId,
      name: userInfo.name,
      avatar: userInfo.avatar,
    }
  }

  formatMessage = (message) => {
    return {
      _id: message.id,
      text: message.body,
      createdAt: new Date(message.inserted_at),
      user: this.formattedUser(message.user_id)
    }
  }

  formatMessages = (messages) => {
    return flow(
      map(this.formatMessage),
      sortBy(['createdAt', '_id']),
      reverse
    )(this.props.messages)
  }

  // CHAT CHANNEL SETUP AND HANDLERS

  setUpChat = () => {
    this.addRoomChannel()
    this.addMessageHandlerToChannel()
    this.joinChannel()
  }

  addRoomChannel = () => {
    const socket = new Socket(serverUrl)
    socket.connect()
    this.channel = socket.channel(`room:${this.post.room_id}`, {})
  }

  joinChannel = () => {
    this.channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) })
  }

  addMessageHandlerToChannel = () => {
    this.channel.on("new_message", this.props.updateMessage)
  }

  pushMessageToChannel = (msg) => {
    this.channel.push("new_message", {
      body: msg.text,
      post_id: this.post.id,
      user_id: this.props.currentUserId
    })
  }

  // COMPONENT LIFECYCLE

  componentDidMount() {
    this.props.getUsersForPost(this.post.id)
    this.props.getMessagesForPost(this.post.id)
    this.setUpChat()
  }

  componentWillUnmount() {
    this.channel.leave()
  }

  // ACTIONS

  onSend = (messages = []) => {
    const sentMessage = messages[messages.length - 1]
    this.pushMessageToChannel(sentMessage)
    this.setState({text: ''})
  }

  // RENDER

  render() {
    return (
      <GiftedChat
        messages={this.formatMessages()}
        onSend={this.onSend}
        user={{_id: this.props.currentUserId}}
      />
    )
  }
}

// ===============
//   CONNECTION
// ===============

const mapStateToProps = (state, props) => {
  const post = __postFromProps(props)
  const currentUserId = state.auth && state.auth.currentUser && state.auth.currentUser.id
  return {
    messages: Object.values(state.messages).filter(m => m.room_id === post.room_id),
    users: state.users,
    currentUserId
  }
}

export default connect(
  mapStateToProps,
  {
    getUsersForPost,
    getMessagesForPost,
    updateMessage: messageActions.updateMessage
  }
)(PostChat)
