import React, { Component } from 'react'
import {
  Alert,
  Text,
  View,
  Link,
  WebView,
  StyleSheet,
  Button
} from 'react-native'

import { connect } from 'react-redux'

import { deletePost } from '../../data/posts'

// ===============
//     STYLES
// ===============

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

// ===============
//    CHILDREN
// ===============

const EditPostButton = (props) => (
  <Button title="Edit Post" onPress={() => props.navigation.navigate('EditPost', {postInfo: props.post})} />
)

const DeletePostButton = (props) => (
  <Button title="Remove Post" onPress={() => {
    Alert.alert(
      'Remove Post',
      'Are you sure?', [{
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: props.removePost
        },
      ], {
        cancelable: true
      }
    )
  }
  } />
)

// ===============
//    PRESENTER
// ===============

class Post extends Component {
  static navigationOptions = {
    title: 'Post'
  }

  get post() {
    return this.props.post
  }

  goToPost = () => {
     this.props.navigation.navigate('PostPreview', {post: this.post})
  }

  goToChat = () => {
     this.props.navigation.navigate('PostChat', {post: this.post})
  }

  removePost = () => {
    this.props.deletePost(this.post.id).then(
      this.props.navigation.goBack()
    )
  }

  render() {
    return (
      <View style={styles.post}>
        <EditPostButton navigation={this.props.navigation} post={this.post} />
        <Text style={styles.title}> {this.post.title} </Text>
        <Text style={styles.description}> {this.post.description} </Text>
        <Button onPress={this.goToPost} style={styles.previewLink} title={this.post.url} />
        <Button onPress={this.goToChat} style={styles.chatLink} title="Enter Discussion"/>
        <DeletePostButton removePost={this.removePost}/>
      </View>
    )
  }
}

// ===============
//   CONNECTION
// ===============

const mapStateToProps = (state, props) => {
  return {
    post: state.posts[props.navigation.state.params.post.id]
  }
}

export default connect(
  mapStateToProps,
  { deletePost }
)(Post)
