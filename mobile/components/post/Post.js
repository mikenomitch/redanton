import React from 'react'
import { Text, View, Link } from 'react-native'

import PostChat from '../chat/PostChat'

class Post extends React.Component {
  static navigationOptions = {
    title: 'Post'
  }

  getPost() {
    return this.props.navigation.state.params.post
  }

  render() {
    const post = this.getPost()
    return (
      <View>
        <Text>{post.title}</Text>
        <Text>{post.description}</Text>
        <PostChat id={post.id} />
      </View>
    )
  }
}

export default Post
