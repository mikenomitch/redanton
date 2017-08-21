import React, { Component } from 'react'
import { WebView } from 'react-native'

class PostPreview extends Component {
  get post() {
    return this.props.navigation.state.params.post
  }

  get uri () {
    if (!/^(?:f|ht)tps?\:\/\//.test(this.post.url)) {
      return 'http://' + this.post.url
    }
    return this.post.url
  }

  render() {
    return (
      <WebView
        style={{
          width: '100%',
          height: '100%'
        }}
        startInLoadingState
        automaticallyAdjustContentInsets={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true}
        source={{uri: this.uri}}
      />
    )
  }
}

export default PostPreview
