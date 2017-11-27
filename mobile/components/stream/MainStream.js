import React, { PureComponent } from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'

import Stream from './Stream'
import Loading from '../ui/Loading'
import withPagination from '../helpers/withPagination'

import { getUsersForMain } from '../../data/users'
import { getFrontPagePosts } from '../../data/posts'
import { getClubs } from '../../data/clubs'
import { getChannels } from '../../data/channels'
import { callsDone, callSuccessfull } from '../../data/calls'

// ===============
//    PRESENTER
// ===============

class MainStream extends PureComponent {
  static navigationOptions = {
    title: 'Your Stream'
  }

  componentDidMount() {
    this.props.getFrontPagePosts()
    this.props.getChannels()
    this.props.getClubs()
    this.props.getUsersForMain()
  }

  get sortedPosts() {
    return Object.values(this.props.posts).sort((a, b) => (
      new Date(b.last_activity_time) - new Date(a.last_activity_time)
    ))
  }

  refresh = (cb) => {
    this.props.onRefresh()
    this.props.getFrontPagePosts(cb)
  }

  onEndHitCb = () => {
    return this.props.onEndHitCb(this.props.getFrontPagePosts)
  }

  render() {
    if (!this.props.firstLoadComplete) {
      return <Loading />
    }

    return (
      <Stream
        currentUserId={this.props.currentUserId}
        refresh={this.refresh}
        onEndHit={this.onEndHitCb()}
        navigation={this.props.navigation}
        content={this.sortedPosts}
        channels={this.props.channels}
        users={this.props.users}
        currentlyLoading={this.props.currentlyLoading && !this.props.atFinalPage}
      />
    )
	}
}

// ===============
//   CONNECTION
// ===============

const mapStateToProps = (state) => {
  return {
    posts: state.posts,
    channels: state.channels,
    users: state.users,
    firstLoadComplete: callsDone(
      state,
      ['frontPagePosts', 'mainUsers', 'clubs', 'channels']
    ),
    currentlyLoading: !callSuccessfull(state, ['frontPagePosts']),
    currentUserId: state.auth.currentUser.id
  }
}

export default connect(
  mapStateToProps,
  {
    getClubs,
    getChannels,
    getFrontPagePosts,
    getUsersForMain
  }
)(withPagination(MainStream))
