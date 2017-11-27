import React, { PureComponent } from 'react'
import {
  Button,
  StyleSheet,
  Text,
  View
 } from 'react-native'
import { connect } from 'react-redux'

import { getUsersForMain } from '../../data/users'
import { getPostsForClub } from '../../data/posts'

import { spacing } from '../styleConstants'

import NewChannelButton from '../channel/NewChannelButton'
import Stream from '../stream/Stream'
import Footer from '../ui/Footer'

// ===============
//     STYLES
// ===============

function channelsForClub(channels, clubId) {
  return channels.filter((chan) => chan.club_id === clubId )
}

const inChannels = (chanIds) => (post) => {
  return chanIds.includes(post.channel_id)
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%'
  },
  content: {
    height: '90%'
  },
  empty: {
    alignItems: 'center',
    padding: spacing.container
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

class Club extends PureComponent {
  get club() {
    return this.props.navigation.state.params.club
  }

  get channelIds() {
    return this.props.channels.map((ch) => ch.id)
  }

  get sortedPosts() {
    return Object.values(this.props.posts)
      .filter(inChannels(this.channelIds))
      .sort((a, b) => (
        new Date(b.last_activity_time) - new Date(a.last_activity_time)
      ))
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
    this.props.getPostsForClub(this.club.id)
    this.props.getUsersForMain()
  }

  onEndHit = () => {
    if (this.state.endOfList) { return }

    const nextPage = this.state.requestPage + 1

    this.props.getPostsForClub(
      this.club.id,
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

  refresh = (cb) => {
    this.props.getPostsForClub(this.club.id, cb)
  }

  renderNoChannels () {
    return (
      <View style={styles.empty}>
        <Text> This club has no channels. </Text>
        <Text> Add a category to get started. </Text>
        <NewChannelButton clubId={this.club.id} navigation={this.props.navigation}/>
      </View>
    )
  }

  render() {
    const {
      channels,
      navigation,
      posts,
      users
    } = this.props

    if (!channels[0]) return this.renderNoChannels()

    return (
      <View style={styles.root}>
        <Stream
          currentUserId={this.props.currentUserId}
          refresh={this.refresh}
          navigation={navigation}
          content={this.sortedPosts}
          channels={channels}
          users={users}
          currentlyLoading={!this.state.endOfList}
          onEndHit={this.onEndHit}
        />
      </View>
    )
  }
}

// ===============
//   CONNECTION
// ===============

const mapStateToProps = (state, props) => {
  const clubId = props.navigation.state.params.club.id
  const channels = Object.values(state.channels)
  const currentUserId = state.auth.currentUser.id

  return {
    posts: state.posts,
    channels: channelsForClub(channels, clubId),
    users: state.users,
    clubId,
    currentUserId
  }
}

export default connect(
  mapStateToProps,
  {
    getPostsForClub,
    getUsersForMain
  }
)(Club)
