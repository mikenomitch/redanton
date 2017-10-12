import React from 'react'
import { connect } from 'react-redux'

const ChannelTitle = (props) => (props.name)

const mapStateToProps = (state, props) => {
  const chanId = props.navigation.state.params.channel.id
  const channel = state.channels[chanId] && props.navigation.state.params.channel
  return {
    name: channel.name || 'Channel'
  }
}

export default connect(
  mapStateToProps, null
)(ChannelTitle)
