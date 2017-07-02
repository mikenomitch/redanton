import React from 'react'
import { Text, View, Button } from 'react-native'

class Post extends React.Component {
  static navigationOptions = {
    title: 'Post',
  }

  render() {
    return (
      <View>
        <Text>Post</Text>
      </View>
    )
  }
}

export default Post