import React, { Component } from 'react'
import {
  Button,
  StyleSheet,
  View,
  WebView
 } from 'react-native'

import { confirmMessage } from '../../lib/uiActions'
import { deletePost } from '../../data/posts'

import Footer from '../ui/Footer'

import { connect } from 'react-redux'

// ===============
//     STYLES
// ===============

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%'
  },
  webView: {
    width: '100%',
    height: '90%'
  },
  footerContent: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  }
})

// ===============
//    CHILDREN
// ===============

const EditPostButton = (props) => (
  <Button title="Edit" onPress={() => props.navigation.navigate('EditPost', {postInfo: props.post})} />
)

const DeletePostButton = (props) => (
  <Button title="Remove" onPress={() => {
    confirmMessage('Remove Post', 'Are you sure?', props.removePost)
  }} />
)

// ===============
//    PRESENTER
// ===============

class Post extends Component {
  get post() {
    return this.props.post || {}
  }

  get uri () {
    if (!/^(?:f|ht)tps?\:\/\//.test(this.post.url)) {
      return 'http://' + this.post.url
    }
    return this.post.url
  }

  removePost = () => {
    this.props.deletePost(this.post.id, this.props.navigation.goBack)
  }

  goToChat = () => {
    this.props.navigation.navigate('PostChat', {post: this.post})
  }

  renderEdit () {
    if ( this.props.userIsOwner ) {
      return <EditPostButton navigation={this.props.navigation} post={this.post} />
    }
  }

  renderDelete () {
    if ( this.props.userIsOwner ) {
      return <DeletePostButton removePost={this.removePost}/>
    }
  }

  render() {
    return (
      <View style={styles.root}>
        <WebView
          style={styles.webView}
          startInLoadingState
          automaticallyAdjustContentInsets={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={true}
          source={{uri: this.uri}}
        />
        <Footer>
          <View style={styles.footerContent}>
            {this.renderDelete()}
            {this.renderEdit()}
            <Button
              title="Chat >"
              onPress={this.goToChat}
            />
          </View>
        </Footer>
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