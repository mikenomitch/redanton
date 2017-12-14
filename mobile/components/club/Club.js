import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Text,
  View
 } from 'react-native'
import { connect } from 'react-redux'

import { getUsersForMain } from '../../data/users'
import { getPostsForClub } from '../../data/posts'
import { getMemberships } from '../../data/memberships'

import { colors, spacing, font } from '../styleConstants'

import withPagination from '../helpers/withPagination'
import NewChannelButton from '../channel/NewChannelButton'
import NeedChannelPrompt from '../channel/NeedChannelPrompt'

import withDebouncedNav from '../helpers/withDebouncedNav'

import Stream from '../stream/Stream'
import Footer from '../ui/Footer'
import Loading from '../ui/Loading'
import LinkButton from '../ui/LinkButton'

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
  },
  warningWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: spacing.medium
  },
  warning: {
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: spacing.medium
  },
  warningText: {
    width: '100%',
    fontSize: font.large
  }
})

// ===============
//    PRESENTER
// ===============

class Club extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      initialLoadDone: false
    }
  }

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

  get needsPosts () {
    return this.sortedPosts.length === 0
  }

  componentDidMount() {
    this.props.getMemberships(this.club.id)
    this.props.getPostsForClub(this.club.id, this.markLoaded)
    this.props.getUsersForMain()
  }

  markLoaded = () => {
    this.setState({initialLoadDone: true})
  }

  refresh = (cb) => {
    this.props.getPostsForClub(this.club.id, cb)
  }

  onEndHitCb = () => {
    return this.props.onEndHitCb( (onSuccess, nextPage) => {
      this.props.getPostsForClub(this.club.id, onSuccess, nextPage)
    })
  }

  renderNoChannels = () => {
    return (
      <View style={styles.root}>
        <NeedChannelPrompt inClub navigation={this.props.navigation} />
      </View>
    )
  }

  renderInvitePromptIfNeeded = () => {
    if (this.props.singleMember) {
      return (
        <View style={styles.warningWrapper}>
          <View style={styles.warning}>
            <Text style={styles.warningText}>
              This club has no other members
            </Text>
            <LinkButton
              title="+ Invite Users"
              onPress={() => this.props.debouncedNav('Invite', {clubId: this.club.id})}
            />
          </View>
        </View>
      )
    }
  }

  render() {
    const {
      channels,
      navigation,
      posts,
      users
    } = this.props

    if (!this.state.initialLoadDone && this.needsPosts) { return <Loading /> }
    if (!channels[0]) { return this.renderNoChannels() }

    return (
      <View style={styles.root}>
        {this.renderInvitePromptIfNeeded()}
        <Stream
          inClub
          currentUserId={this.props.currentUserId}
          refresh={this.refresh}
          navigation={navigation}
          needsPosts={this.needsPosts}
          content={this.sortedPosts}
          channels={channels}
          users={users}
          currentlyLoading={!this.props.atFinalPage}
          onEndHit={this.onEndHitCb()}
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

  const memberships = Object.values(state.memberships).filter(
    (m) => m.club_id === clubId
  )

  const singleMember = memberships.length === 1

  return {
    posts: state.posts,
    channels: channelsForClub(channels, clubId),
    users: state.users,
    singleMember: singleMember,
    clubId,
    currentUserId
  }
}

export default connect(
  mapStateToProps,
  {
    getMemberships,
    getPostsForClub,
    getUsersForMain
  }
)(withPagination(withDebouncedNav(Club)))
