import React, { PureComponent } from 'react'
import {
  StyleSheet,
  View
 } from 'react-native'
import { connect } from 'react-redux'

import { confirmMessage } from '../../lib/uiActions'
import { getUsersForMain } from '../../data/users'
import { getPostsForTag } from '../../data/posts'

import withPagination from '../helpers/withPagination'
import withDebouncedNav from '../helpers/withDebouncedNav'

import Stream from '../stream/Stream'
import Loading from '../ui/Loading'
import LinkButton from '../ui/LinkButton'
import Footer from '../ui/Footer'

// ===============
//     STYLES
// ===============

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%'
  },
  content: {
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
    // FILTER DOWN WITH POSTS_TAGS
    return Object.values(this.props.posts)
      .sort((a, b) => (
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
        <View style={styles.content}>
          {this.renderStream()}
        </View>
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
    posts: state.posts,
    tags: state.tags,
    users: state.users,
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
