import React, { Component } from 'react'
import { WebView } from 'react-native'

class PostPreview extends Component {
  get post() {
    return this.props.navigation.state.params.post
  }

  render() {
    return (
      <WebView
        style={{
          width: '100%',
          height: '100%'
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={true}
        source={{uri: this.post.url}}
      />
    )
  }
}

export default PostPreview
