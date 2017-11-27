import React, { Component } from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'

import Stream from './Stream'
import Loading from '../ui/Loading'

import { getUsersForMain } from '../../data/users'
import { getFrontPagePosts } from '../../data/posts'
import { getClubs } from '../../data/clubs'
import { getChannels } from '../../data/channels'
import { callsDone, callSuccessfull } from '../../data/calls'

// ===============
//    PRESENTER
// ===============

class MainStream extends Component {
  static navigationOptions = {
    title: 'Your Stream'
  }

  constructor(props) {
    super(props)
    this.state = {
      requestPage: 1,
      lastRequestTime: null,
      endOfList: false
    }
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
    this.props.getFrontPagePosts(cb)
  }

  onEndHit = () => {
    if (this.state.endOfList) { return }

    const nextPage = this.state.requestPage + 1

    this.props.getFrontPagePosts(
      this.setNextRequestPageCb(nextPage),
      nextPage
    )
  }

  setNextRequestPageCb = (page) => ({data}) => {
    const endOfList = data.length === 0

    this.setState({
      requestPage: page,
      endOfList
    })
  }

  render() {
    if (!this.props.firstLoadComplete) {
      return <Loading />
    }

    return <Stream
      currentUserId={this.props.currentUserId}
      refresh={this.refresh}
      onEndHit={this.onEndHit}
      navigation={this.props.navigation}
      content={this.sortedPosts}
      channels={this.props.channels}
      users={this.props.users}
      currentlyLoading={this.props.currentlyLoading && !this.state.endOfList}
    />
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
)(MainStream)
