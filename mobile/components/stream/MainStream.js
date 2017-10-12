import React, { PureComponent} from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'

import Stream from './Stream'

import { getUsersForMain } from '../../data/users'
import { getFrontPagePosts } from '../../data/posts'
import { getClubs } from '../../data/clubs'
import { getChannels } from '../../data/channels'
import { callsDone } from '../../data/calls'

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

  refresh = (cb) => {
    this.props.getFrontPagePosts(cb)
  }

  render() {
    if (!this.props.loaded) {
      return <Text> loading... </Text>
    }

    return <Stream
      currentUserId={this.props.currentUserId}
      refresh={this.refresh}
      navigation={this.props.navigation}
      content={this.props.posts}
      channels={this.props.channels}
      users={this.props.users}
    />
	}
}

// ===============
//   CONNECTION
// ===============

const mapStateToProps = (state) => {
  const sortedPosts = Object.values(state.posts)
    .sort((a, b) => (
      new Date(b.last_activity_time) - new Date(a.last_activity_time)
    ))

  const currentUserId = state.auth.currentUser.id

  return {
    posts: sortedPosts,
    channels: state.channels,
    users: state.users,
    loaded: callsDone(
      state,
      ['frontPagePosts', 'mainUsers', 'clubs', 'channels']
    ),
    currentUserId
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
