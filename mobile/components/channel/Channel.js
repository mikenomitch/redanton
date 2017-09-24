import React, {Component} from 'react'
import {
  Button,
  View
 } from 'react-native'

import Stream from '../stream/Stream'

import { connect } from 'react-redux'

import { confirmMessage } from '../../lib/uiActions'
import { getUsersForMain } from '../../data/users'
import { getPostsForChannel } from '../../data/posts'
import { deleteChannel } from '../../data/channels'

import Footer from '../ui/Footer'

// ===============
//    PRESENTER
// ===============

class Channel extends Component {
  get channel() {
    return this.props.navigation.state.params.channel
  }

  componentDidMount() {
    this.props.getPostsForChannel(this.channel.id)
    this.props.getUsersForMain()
  }

  removeChannel = () => {
    this.props.deleteChannel(this.channel.id, this.props.navigation.goBack)
  }

  render() {
    const {
      channels,
      navigation,
      posts,
      users
    } = this.props

    return (
      <View style={{
        width: '100%',
        height: '100%'
      }}>
        <View style={{height: '90%'}}>
          <Stream
            navigation={navigation}
            content={posts}
            channels={channels}
            users={users}
          />
        </View>
        <Footer>
          <View style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}>
            <Button title="Remove Channel" onPress={() => {
              confirmMessage('Remove Channel', 'Are you sure? This will remove all its posts.', this.removeChannel)
            }} />
            <Button title="Edit Channel" onPress={() => navigation.navigate('EditChannel', {channelInfo: this.channel})} />
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

  return {
    posts: Object.values(state.posts).filter((p) => p.channel_id == channelId),
    channels: state.channels,
    users: state.users
  }
}

export default connect(
  mapStateToProps,
  {
    deleteChannel,
    getPostsForChannel,
    getUsersForMain
  }
)(Channel)
