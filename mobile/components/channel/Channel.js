import React, {Component} from 'react'
import Stream from '../stream/Stream'

import { connect } from 'react-redux'

import { getUsersForMain } from '../../data/users'
import { getPostsForChannel } from '../../data/posts'

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

  render() {
    return (
      <Stream
        navigation={this.props.navigation}
        content={this.props.posts}
        channels={this.props.channels}
        users={this.props.users}
      />
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
    getPostsForChannel,
    getUsersForMain
  }
)(Channel)
