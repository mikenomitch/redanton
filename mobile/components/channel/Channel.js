import React, {Component} from 'react'
import Stream from '../stream/Stream'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

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
  }

  render() {
    return (
      <Stream navigation={this.props.navigation} content={this.props.posts} />
    )
  }
}

// ===============
//   CONNECTION
// ===============

const mapStateToProps = (state, props) => {
  const channelId = props.navigation.state.params.channel.id

  return {
    posts: Object.values(state.posts).filter((p) => p.channel_id == channelId)
  }
}

const mapDispatchToProps = (dispatch) => {
  return	{
    getPostsForChannel: bindActionCreators(getPostsForChannel, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Channel)
