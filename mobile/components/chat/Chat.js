import React, { Component } from 'react'
import {
  Text,
  View
} from 'react-native'
import { Socket } from "phoenix"

import flow from 'lodash/fp/flow'
import map from 'lodash/fp/map'
import reverse from 'lodash/fp/reverse'
import sortBy from 'lodash/fp/sortBy'

import { connect } from 'react-redux'
import { GiftedChat } from 'react-native-gifted-chat'

import { serverUrl } from '../../lib/serverInfo'

import {
  messageActions,
  getMessagesForPost
} from '../../data/messages'
import { getUsersForPost } from '../../data/users'

// ===============
//    PRESENTER
// ===============

const defaultUser = {
  name: 'unknown',
  avatar: 'https://d30y9cdsu7xlg0.cloudfront.net/png/60319-200.png'
}

export default class Chat extends Component {

  // GENERAL HELPERS

  get post() {
    return this.props.post
  }

  formattedUser = (userId) => {
    const userInfo = this.props.users[userId] || defaultUser
    return {
      _id: userId,
      name: userInfo.name || userInfo.email || "?"
      // avatar: goes here once you make it
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
    const socket = new Socket(`${serverUrl}/socket`)
    socket.connect()
    this.channel = socket.channel(`room:${this.post.room_id}`, {})
  }

  joinChannel = () => {
    this.channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) })
  }

  addMessageHandlerToChannel = () => {
    this.channel.on("new_msg", this.props.updateMessage)
  }

  pushMessageToChannel = (msg) => {
    this.channel.push("new_msg", {
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
        user={this.formattedUser(this.props.currentUserId)}
      />
    )
  }
}
