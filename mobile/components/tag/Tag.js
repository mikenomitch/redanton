import React, { PureComponent } from 'react'
import {
  StyleSheet,
  View
 } from 'react-native'
import { connect } from 'react-redux'

import { confirmMessage } from '../../lib/uiActions'
import { getUsersForMain } from '../../data/users'
import { getPostsForTag } from '../../data/posts'
import { postsForTag } from '../../data/postsTags'

import withPagination from '../helpers/withPagination'
import withDebouncedNav from '../helpers/withDebouncedNav'

import Stream from '../stream/Stream'
import Loading from '../ui/Loading'

// ===============
//     STYLES
// ===============

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%'
  }
})

// ===============
//    PRESENTER
// ===============

class Tag extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      initialLoadDone: false
    }
  }

  get tag() {
    return this.props.navigation.state.params.tag
  }

  get sortedPosts() {
    return Object.values(this.props.posts).sort((a, b) => (
      new Date(b.last_activity_time) - new Date(a.last_activity_time)
    ))
  }

  get needsPosts () {
    return this.sortedPosts.length === 0
  }

  markLoaded = () => {
    this.setState({initialLoadDone: true})
  }

  componentDidMount() {
    this.props.getPostsForTag(this.tag.id, this.markLoaded)
    this.props.getUsersForMain()
  }

  refresh = (cb) => {
    this.props.getPostsForTag(this.tag.id, cb)
  }

  onEndHitCb = () => {
    return this.props.onEndHitCb( (onSuccess, nextPage) => {
      this.props.getPostsForTag(this.tag.id, onSuccess, nextPage)
    })
  }

  renderStream () {
    const {
      navigation,
      posts,
      clubs,
      tags,
      users
    } = this.props

    if (!this.state.initialLoadDone && this.needsPosts) { return <Loading /> }

    return (
      <Stream
        inTag
        needsPosts={this.needsPosts}
        currentUserId={this.props.currentUserId}
        refresh={this.refresh}
        navigation={navigation}
        content={this.sortedPosts}
        tags={tags}
        clubs={clubs}
        users={users}
        onEndHit={this.onEndHitCb()}
        currentlyLoading={!this.props.atFinalPage}
      />
    )
  }

  render() {
    return (
      <View style={styles.root}>
        {this.renderStream()}
      </View>
    )
  }
}

// ===============
//   CONNECTION
// ===============

const mapStateToProps = (state, props) => {
  const tagId = props.navigation.state.params.tag.id
  const currentUserId = state.auth.currentUser.id

  return {
    posts: postsForTag(state, props.navigation.state.params.tag),
    tags: state.tags,
    users: state.users,
    clubs: state.clubs,
    tagId,
    currentUserId
  }
}

export default connect(
  mapStateToProps,
  {
    getPostsForTag,
    getUsersForMain
  }
)(withPagination(withDebouncedNav(Tag)))
