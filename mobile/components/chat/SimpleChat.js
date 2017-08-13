import React, {Component} from 'react'
import { Text, View, TextInput } from 'react-native'
import {Socket} from "phoenix"

class SimpleChat extends Component {
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

    this.channel = socket.channel("room:lobby", {})

    this.channel.on("new_msg", payload => {
      let newMsg = this.state.messages.concat([payload.body])
      this.setState({messages: newMsg})
    })

    this.channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) })
  }

  componentWillUnmount() {
    this.channel.leave()
  }

  dispatch = (text) => {
    this.channel.push("new_msg", {body: this.state.text})
    this.setState({text: ''})
  }

  render() {
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