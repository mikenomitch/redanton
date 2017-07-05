import React, { Component } from 'react'
import {
  Text,
  View,
  Link,
  WebView,
  StyleSheet,
  Button
} from 'react-native'

var styles = StyleSheet.create({
  post: {
    flex: 1,
    alignItems: 'center',
    margin: 50
  },
  title: {
    marginBottom: 30,
    fontSize: 23,
    textAlign: 'center'
  },
  description: {
    marginBottom: 30,
    fontSize: 15,
    maxWidth: 300
  },
  previewLink: {
    marginBottom: 50,
    maxWidth: 300
  },
  chatLink: {
    marginBottom: 30
  }
})

class Post extends Component {
  static navigationOptions = {
    title: 'Post'
  }

  get post() {
    return this.props.navigation.state.params.post
  }

  goToPost = () => {
     this.props.navigation.navigate('PostPreview', {post: this.post})
  }

  goToChat = () => {
     this.props.navigation.navigate('PostChat', {post: this.post})
  }

  render() {
    return (
      <View style={styles.post}>
        <Text style={styles.title}> {this.post.title} </Text>
        <Text style={styles.description}> {this.post.description} </Text>
        <Button onPress={this.goToPost} style={styles.previewLink} title={this.post.url} />
        <Button onPress={this.goToChat} style={styles.chatLink} title="Enter Discussion"/>
      </View>
    )
  }
}

export default Post
