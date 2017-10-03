import React, { Component } from 'react'
import {
  StyleSheet,
  View
} from 'react-native'
import merge from 'lodash/fp/merge'

import ChatScreen from '../chat/ChatScreen'

import EditPostButton from './EditPostButton'
import DeletePostButton from './DeletePostButton'
import Footer from '../ui/Footer'

// ===============
//     STYLES
// ===============

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%'
  },
  chatHolder: {
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

export default class DiscussionPost extends Component {
  renderFooter() {
    if ( this.props.userIsOwner ) {
      return (
        <Footer>
          <View style={styles.footerContent}>
            <DeletePostButton removePost={this.props.removePost}/>
            <EditPostButton navigate={this.props.navigation.navigate} post={this.props.post} />
          </View>
        </Footer>
      )
    }
  }

  render() {
    const height = this.props.userIsOwner ? '90%' : '100%'
    const chatStyles = merge(styles.chatHolder, {height})

    return (
      <View style={styles.root} key={this.props.post.id}>
        <View style={chatStyles}>
          <ChatScreen post={this.props.post} navigation={this.props.navigation}/>
        </View>
        {this.renderFooter()}
      </View>
    )
  }
}
