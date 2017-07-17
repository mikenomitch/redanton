import React, { Component } from 'react'
import { Text, View, TextInput } from 'react-native'
import {Socket} from "phoenix"
import sortBy from 'lodash/sortBy'
import reverse from 'lodash/reverse'
import { get } from '../../lib/fetcher'
import { GiftedChat } from 'react-native-gifted-chat'

class PostChat extends Component {
  static defaultProps = { id: 1 }

  constructor(props) {
    super(props)
    this.state = {
      messages: []
    }
  }

  get post() {
    return this.props.navigation.state.params.post
  }

  messagesForGiftedChat() {
    const messages = this.state.messages.map((msg) => {
      return {
        _id: msg.id,
        text: msg.body,
        createdAt: new Date(msg.inserted_at),
        user: {
          _id: 1,
          name: 'Mike Nomitch',
          avatar: 'https://facebook.github.io/react/img/logo_og.png',
        }
      }
    })

    return reverse(sortBy(messages, ['createdAt', '_id']))
  }

  setUpChat() {
    const socket = new Socket("https://stormy-reef-53700.herokuapp.com/socket",)
		const roomId = `room:${this.post.id}`

    socket.connect()
    this.channel = socket.channel(roomId, {})

    this.channel.on("new_msg", payload => {
      const newMsg = this.state.messages.concat([payload])
      this.setState({messages: newMsg})
    })

    this.channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) })
  }

  getMessages() {
    const cb = (resp) => {
      this.setState({messages: resp.data})
    }

    get(`/posts/${this.post.id}/messages`).then(cb)
  }

  componentDidMount() {
    this.getMessages()
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
        messages={this.messagesForGiftedChat()}
        onSend={this.onSend}
        user={{_id: 1}}
      />
    )
  }
}

export default PostChat