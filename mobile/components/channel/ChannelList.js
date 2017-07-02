import React, { Component } from 'react'
import { View, Button, FlatList } from 'react-native'

class ChannelList extends Component {
  static navigationOptions = {
    title: 'Channels'
  }

  channelsData = () => {
    return {
      data: [
        {id: 1, name: 'Videos', description: 'Foo Bar Baz'},
        {id: 2, name: 'Articles', description: 'Foo Bar Baz'},
        {id: 3, name: 'Tech', description: 'Foo Bar Baz'}
      ]
    }
  }

  renderChannelLink = (datum) => {
    const { navigate } = this.props.navigation
    return (
      <Button
        onPress={() => navigate('Channel', {channel: datum.item})}
        title={datum.item.name}
      />
    )
  }

  render() {
    return (
      <View>
        <FlatList
          data={this.channelsData()["data"]}
          renderItem={this.renderChannelLink}
          keyExtractor={(item) => item.id}
        />
      </View>
    )
  }
}

export default ChannelList
