import React from 'react'
import { Text, View, Button } from 'react-native'

class Channel extends React.Component {
  static navigationOptions = {
    title: 'Channel'
  }

  render() {
    const { navigate } = this.props.navigation
    return (
      <View>
        <Text>This is a Channel</Text>
      </View>
    )
  }
}

export default Channel