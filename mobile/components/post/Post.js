import React, { Component } from 'react'
import {
  Button,
  StyleSheet,
  View,
  WebView,
  Linking
 } from 'react-native'

 import Icon from 'react-native-vector-icons/FontAwesome'

 import { confirmMessage } from '../../lib/uiActions'
 import { deletePost } from '../../data/posts'

 import Footer from '../ui/Footer'
 import SimpleButton from '../ui/SimpleButton'

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

const EditPostButton = (props) => {
  const onPress = () => props.navigation.navigate('EditPost', {postInfo: props.post})

  return (
    <SimpleButton onPress={onPress} >
      <Icon name="pencil" size={20} color="#007aff" />
    </SimpleButton>
  )
}

const DeletePostButton = (props) => {
  const onPress = () => {
    confirmMessage('Remove Post', 'Are you sure?', props.removePost)
  }

  return (
    <SimpleButton onPress={onPress} >
      <Icon name="trash" size={20} color="#007aff" />
    </SimpleButton>
  )
}

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

  constructor(props){
    super(props)
    this.state = {
      secondPassed: false
    }
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
      <View style={styles.root} key={this.post.id}>
        <WebView
          source={{uri: this.uri}}
          ref={(ref) => { this.webview = ref }}
          style={styles.webView}
          onNavigationStateChange={(event) => {
            if (event.url !== this.uri && this.state.secondPassed) {
              this.webview.stopLoading()
              Linking.openURL(event.url)
            }
          }}
          onLoadEnd={() => {
            setTimeout(() => {
              this.state.secondPassed = true
            }, 1000)
          }}
          allowsInlineMediaPlayback
          automaticallyAdjustContentInsets
          domStorageEnabled
          javaScriptEnabled
          scalesPageToFit
          startInLoadingState
          thirdPartyCookiesEnabled
        />
        <Footer>
          <View style={styles.footerContent}>
            {this.renderDelete()}
            {this.renderEdit()}
            <SimpleButton onPress={this.goToChat} >
              <Icon name="comment" size={20} color="#007aff" />
            </SimpleButton>
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