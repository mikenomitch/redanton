import React, { Component} from 'react'
import Stream from './Stream'

import { connect } from 'react-redux'

import { getUsersForMain } from '../../data/users'
import { getFrontPage } from '../../data/posts'

// ===============
//    PRESENTER
// ===============

class MainStream extends Component {
  static navigationOptions = {
  	title: 'Your Stream'
  }

  componentDidMount() {
  	this.props.getFrontPage()
    this.props.getUsersForMain()
  }

  render() {
    return <Stream
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
  return {
    posts: Object.values(state.posts),
    channels: state.channels,
    users: state.users
  }
}

export default connect(
  mapStateToProps,
  {
    getFrontPage,
    getUsersForMain
  }
)(MainStream)
