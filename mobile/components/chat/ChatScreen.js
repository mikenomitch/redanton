import React from 'react'
import { connect } from 'react-redux'

import {
  messageActions,
  getMessagesForPost
} from '../../data/messages'

import { getUsersForPost } from '../../data/users'

import Chat from './Chat'

// ===============
//    PRESENTER
// ===============

function __postFromNavigation (props) {
  return props.navigation.state.params.post
}

// ===============
//   CONNECTION
// ===============

const mapStateToProps = (state, props) => {
  const post = props.post || __postFromNavigation(props)
  const currentUserId = state.auth && state.auth.currentUser && state.auth.currentUser.id
  return {
    post: __postFromNavigation(props),
    messages: Object.values(state.messages).filter(m => m.room_id === post.room_id),
    users: state.users,
    currentUserId
  }
}

export default connect(
  mapStateToProps,
  {
    getUsersForPost,
    getMessagesForPost,
    updateMessage: messageActions.updateMessage
  }
)(Chat)
