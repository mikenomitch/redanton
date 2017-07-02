import React from 'react'
import { Text, View, Button } from 'react-native'

class Channel extends React.Component {
  static navigationOptions = {
    title: 'Channel'
  }

  getChannel() {
    return this.props.navigation.state.params.channel
  }

  render() {
    const channel = this.getChannel()
    return (
      <View>
        <Text>{channel.name}</Text>
        <Text>{channel.description}</Text>
      </View>
    )
  }
}

export default Channel