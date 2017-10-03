import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  WebView,
  Linking
 } from 'react-native'

 import Icon from 'react-native-vector-icons/FontAwesome'

 import { confirmMessage } from '../../lib/uiActions'
 import { deletePost } from '../../data/posts'

 import EditPostButton from './EditPostButton'
 import DeletePostButton from './DeletePostButton'

 import Footer from '../ui/Footer'
 import SimpleButton from '../ui/SimpleButton'

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
//    PRESENTER
// ===============

export default class LinkPost extends Component {
  constructor(props){
    super(props)
    this.state = {
      linkExternally: false
    }
  }

  // helpers

  get uri () {
    if (!/^(?:f|ht)tps?\:\/\//.test(this.props.post.url)) {
      return 'http://' + this.props.post.url
    }
    return this.props.post.url
  }

  // actions

  goToChat = () => {
    this.props.navigation.navigate('PostChat', {post: this.props.post})
  }

  setTimePassed = () => {
    const timeBeforeExternalLinking = 2000
    setTimeout(() => { this.state.linkExternally = true }, timeBeforeExternalLinking)
  }

  // rendering

  renderWebView () {
    return (
      <WebView
        source={{uri: this.uri}}
        ref={(ref) => { this.webview = ref }}
        style={styles.webView}
        onNavigationStateChange={(event) => {
          if (event.url !== this.uri && this.state.linkExternally) {
            this.webview.stopLoading()
            Linking.openURL(event.url)
          }
        }}
        onLoadEnd={this.setTimePassed}
        allowsInlineMediaPlayback
        automaticallyAdjustContentInsets
        domStorageEnabled
        javaScriptEnabled
        scalesPageToFit
        startInLoadingState
        thirdPartyCookiesEnabled
      />
    )
  }

  renderEdit () {
    if ( this.props.userIsOwner ) {
      return <EditPostButton navigate={this.props.navigation.navigate} post={this.props.post} />
    }
  }

  renderDelete () {
    if ( this.props.userIsOwner ) {
      return <DeletePostButton removePost={this.props.removePost}/>
    }
  }

  renderGoToChat () {
    return (
      <SimpleButton onPress={this.goToChat} >
        <Icon name="comment" size={20} color="#007aff" />
      </SimpleButton>
    )
  }

  render() {
    return (
      <View style={styles.root} key={this.props.post.id}>
        {this.renderWebView()}
        <Footer>
          <View style={styles.footerContent}>
            {this.renderDelete()}
            {this.renderEdit()}
            {this.renderGoToChat()}
          </View>
        </Footer>
      </View>
    )
  }
}
