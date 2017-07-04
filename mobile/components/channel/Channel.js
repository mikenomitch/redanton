import React from 'react'
import Stream from '../stream/Stream'

import { get } from '../../lib/fetcher'

class Channel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: []
    }
  }

  get channel() {
    return this.props.navigation.state.params.channel
  }

  componentDidMount() {
    get(`/channels/${this.channel.id}/posts`).then(data => {
      this.setState({
        posts: data['data']
      })
    })
  }

  render() {
    const streamContent = this.state.posts
    return (
      <Stream navigation={this.props.navigation} content={streamContent} />
    )
  }
}

export default Channel