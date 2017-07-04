import React from 'react'
import { Text, View, Link } from 'react-native'

import PostChat from '../chat/PostChat'

class Post extends React.Component {
  static navigationOptions = {
    title: 'Post'
  }

  get post() {
    return this.props.navigation.state.params.post
  }

  render() {
    return (
      <View>
        <PostChat id={this.post.id} />
        <Text>{this.post.title}</Text>
        <Text>{this.post.description}</Text>
      </View>
    )
  }
}

export default Post
