import React, { Component} from 'react'
import Stream from './Stream'

import { connect } from 'react-redux'

import { getUsersForMain } from '../../data/users'
import { getFrontPage } from '../../data/posts'
import { getClubs } from '../../data/clubs'

// ===============
//    PRESENTER
// ===============

class MainStream extends Component {
  static navigationOptions = {
  	title: 'Your Stream'
  }

  componentDidMount() {
    this.props.getFrontPage()
    this.props.getClubs()
    this.props.getUsersForMain()
  }

  refresh = (cb) => {
    this.props.getFrontPage(cb)
  }

  render() {
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
    currentUserId
  }
}

export default connect(
  mapStateToProps,
  {
    getClubs,
    getFrontPage,
    getUsersForMain
  }
)(MainStream)
