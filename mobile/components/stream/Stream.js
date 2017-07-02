import React, { Component } from 'react'
import { View, Button, FlatList } from 'react-native'

class Stream extends Component {
  renderPostLink = (datum) => {
    const { navigate } = this.props.navigation
    return (
      <Button
        onPress={() => navigate('Post', {post: datum.item})}
        title={datum.item.title}
      />
    )
  }

  render() {
    return (
      <View>
        <FlatList
          data={this.props.content}
          renderItem={this.renderPostLink}
          keyExtractor={(item) => item.id}
        />
      </View>
    )
  }
}

export default Stream
