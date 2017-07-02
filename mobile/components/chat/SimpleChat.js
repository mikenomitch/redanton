import React from 'react'
import { Text, View, TextInput } from 'react-native'
import {Socket} from "phoenix"

class SimpleChat extends React.Component {
  static navigationOptions = {
    title: 'Chat',
  }

  constructor() {
    super()

    this.state = {
      messages: []
    }
  }

  componentDidMount() {
    let socket = new Socket("https://stormy-reef-53700.herokuapp.com/socket",)
    socket.connect()

    let channel = socket.channel("room:lobby", {})
    this.ch = channel

    channel.on("new_msg", payload => {
      let newMsg = this.state.messages.concat([payload.body])
      this.setState({messages: newMsg})
    })

    channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) })
  }

  dispatch = (text) => {
    this.ch.push("new_msg", {body: this.state.text})
    this.setState({text: ''})
  }

  render() {
    let pic = {
      uri: 'https://scontent.ford1-1.fna.fbcdn.net/v/t1.0-9/1012800_2840495368468_1219514545_n.jpg?oh=2c7042c24ba884d1be7b2ed906e498e9&oe=59C8C060'
    }

    return (
      <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 100}}>
        <Text> Simple Chat: </Text>
        {this.state.messages.map((m, i) => <Text key={i}>{m}</Text>)}
        <TextInput onChangeText={this.dispatch} /><TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => {this.setState({text})}}
          onSubmitEditing={this.dispatch}
          value={this.state.text}
        />
      </View>
    )
  }
}

 export default SimpleChat