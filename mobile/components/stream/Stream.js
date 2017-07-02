import React, { Component } from 'react'
import { Text, View, Button, FlatList } from 'react-native'

class Stream extends Component {
  renderItem = (datum) => {
    const { navigate } = this.props.navigation
    return (
      <Button
        onPress={() => navigate('Post')}
        title={datum.item.title}
      />
    )
  }

  render() {
    return (
      <View>
        <FlatList
          data={this.props.content}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.id}
        />

      </View>
    )
  }
}

export default Stream
