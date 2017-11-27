import React, { PureComponent } from 'react'
import {
  Button,
  StyleSheet,
  View
 } from 'react-native'
import { connect } from 'react-redux'

import { confirmMessage } from '../../lib/uiActions'
import { getUsersForMain } from '../../data/users'
import { getPostsForChannel } from '../../data/posts'
import { deleteChannel } from '../../data/channels'

import withPagination from '../helpers/withPagination'
import Stream from '../stream/Stream'
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

class Channel extends PureComponent {
  get channel() {
    return this.props.navigation.state.params.channel
  }

  get sortedPosts() {
    return Object.values(this.props.posts)
      .filter((p) => p.channel_id == this.props.channelId)
      .sort((a, b) => (
        new Date(b.last_activity_time) - new Date(a.last_activity_time)
      ))
  }

  componentDidMount() {
    this.props.getPostsForChannel(this.channel.id)
    this.props.getUsersForMain()
  }

  removeChannel = () => {
    this.props.deleteChannel(this.channel.id, this.props.navigation.goBack)
  }

  removeChannelClick = () => {
    confirmMessage(
      'Remove Channel',
      'Are you sure? This will remove all its posts.',
      this.removeChannel
    )
  }

  editChannelClick = () => {
    this.props.navigation.navigate('EditChannel', {channelInfo: this.channel})
  }

  refresh = (cb) => {
    this.props.getPostsForChannel(this.channel.id, cb)
  }

  onEndHitCb = () => {
    return this.props.onEndHitCb( (onSuccess, nextPage) => {
      this.props.getPostsForChannel(this.channel.id, onSuccess, nextPage)
    })
  }

  render() {
    const {
      channels,
      navigation,
      posts,
      users
    } = this.props

    return (
      <View style={styles.root}>
        <View style={styles.content}>
          <Stream
            currentUserId={this.props.currentUserId}
            refresh={this.refresh}
            navigation={navigation}
            content={this.sortedPosts}
            channels={channels}
            users={users}
            onEndHit={this.onEndHitCb()}
            currentlyLoading={!this.props.atFinalPage}
          />
        </View>
        <Footer>
          <View style={styles.footerContent}>
            <Button title="Remove Channel" onPress={this.removeChannelClick} />
            <Button title="Edit Channel" onPress={this.editChannelClick} />
          </View>
        </Footer>
      </View>
    )
  }
}

// ===============
//   CONNECTION
// ===============

const mapStateToProps = (state, props) => {
  const channelId = props.navigation.state.params.channel.id
  const currentUserId = state.auth.currentUser.id

  return {
    posts: state.posts,
    channels: state.channels,
    users: state.users,
    channelId,
    currentUserId
  }
}

export default connect(
  mapStateToProps,
  {
    deleteChannel,
    getPostsForChannel,
    getUsersForMain
  }
)(withPagination(Channel))
