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

  // HELPERS

  get post() {
    return this.props.post
  }

  // ACTIONS

  goToPost = () => {
    this.props.navigation.navigate('PostPreview', {post: this.post})
  }

  goToChat = () => {
     this.props.navigation.navigate('PostChat', {post: this.post})
  }

  removePost = () => {
    this.props.deletePost(this.post.id, this.props.navigation.goBack)
  }

  // RENDERING

  renderEdit () {
    if ( this.props.userIsOwner ) {
      return (
        <EditPostButton navigation={this.props.navigation} post={this.post} />
      )
    }
  }

  renderDelete () {
    if ( this.props.userIsOwner ) {
      return (
        <DeletePostButton removePost={this.removePost}/>
      )
    }
  }

  renderNoPost () {
    return (
      <View>
        <Text> This post does not exist </Text>
      </View>
    )
  }

  render() {
    if (!this.post) return this.renderNoPost()

    return (
      <View style={styles.post}>
        {this.renderEdit()}
        <Text style={styles.title}> {this.post.title} </Text>
        <Text style={styles.description}> {this.post.description} </Text>
        <Button onPress={this.goToPost} style={styles.previewLink} title={this.post.url} />
        <Button onPress={this.goToChat} style={styles.chatLink} title="Enter Discussion"/>
        {this.renderDelete()}
      </View>
    )
  }
}

// ===============
//   CONNECTION
// ===============

const mapStateToProps = (state, props) => {
  const post = state.posts[props.navigation.state.params.post.id]
  const currentUserId = state.auth.currentUser.id
  const userIsOwner = post && post.user_id === currentUserId
  return { post, userIsOwner }
}

export default connect(
  mapStateToProps,
  { deletePost }
)(Post)
