import React, { Component } from 'react'

import {
  Text,
  View,
  TextInput
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

import { getUsersForClub } from '../../data/users'

// ===============
//    PRESENTER
// ===============

class PostChat extends Component {
  get post() {
    return this.props.navigation.state.params.post
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

  setUpChat() {
    const socket = new Socket(serverUrl)
		const roomId = `room:${this.post.id}`

    socket.connect()
    this.channel = socket.channel(roomId, {})

    this.channel.on("new_msg", payload => {
      this.props.updateMessage(payload)
    })

    this.channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) })
  }

  componentDidMount() {
    // TODO: replace with the right club id
    this.props.getUsersForClub(1)
    this.props.getMessagesForPost(this.post.id)
    this.setUpChat()
  }

  componentWillUnmount() {
    this.channel.leave()
  }

  onSend = (messages = []) => {
    const sentMessage = messages[messages.length - 1]
    this.channel.push("new_msg", {
      body: sentMessage.text,
      user: sentMessage.user,
      post_id: this.post.id
    })
    this.setState({text: ''})
  }

  render() {
    return (
      <GiftedChat
        messages={this.formatMessages()}
        onSend={this.onSend}
        user={{_id: 1}}
      />
    )
  }
}

// ===============
//   CONNECTION
// ===============

const mapStateToProps = (state) => {
  // TODO: return a post_id on all the messages
  // so we can filter here
  // .filter(m => m.room_id === this.props.post.id)
  return {
    messages: Object.values(state.messages),
    users: state.users
  }
}

export default connect(
  mapStateToProps,
  {
    getUsersForClub,
    getMessagesForPost,
    updateMessage: messageActions.updateMessage
  }
)(PostChat)
