import React from 'react'
import { Text, View, Button } from 'react-native'

class ChannelList extends React.Component {
  static navigationOptions = {
    title: 'Channels'
  }

  render() {
    const { navigate } = this.props.navigation
    return (
      <View>
        <Text>This is the Channels list</Text>
        <Button
          onPress={() => navigate('Channel')}
          title="See Channel"
        />
      </View>
    )
  }
}

export default ChannelList