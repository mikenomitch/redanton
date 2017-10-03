import React, { Component } from 'react'
import { connect } from 'react-redux'

import deletePost from '../../data/posts'

import DiscussionPost from './DiscussionPost'
import LinkPost from './LinkPost'

// ===============
//    PRESENTER
// ===============

class Post extends Component {
  get isLinkPost() {
    return !!this.props.post.url
  }

  removePost = () => {
    this.props.deletePost(this.props.post.id, this.props.navigation.goBack)
  }

  render() {
    if (this.isLinkPost) {
      return <LinkPost {...this.props} removePost={this.removePost} />
    } else {
      return <DiscussionPost {...this.props} removePost={this.removePost} />
    }
  }
}

// ===============
//   CONNECTION
// ===============

const mapStateToProps = (state, props) => {
  const post = props.post || state.posts[props.navigation.state.params.post.id]
  const currentUserId = state.auth.currentUser.id
  const userIsOwner = post && post.user_id === currentUserId
  return { post, userIsOwner }
}

export default connect(
  mapStateToProps,
  { deletePost }
)(Post)
