import React from 'react'
import { connect } from 'react-redux'

import LinkButton from '../ui/LinkButton'
import ActionButton from '../ui/ActionButton'
import withDebouncedNav from '../helpers/withDebouncedNav'

const NewPostButton = (props) => {
  const channel = props.navigation.state.params && props.navigation.state.params.channel
  const onPress = () => props.debouncedNav('NewPost', {channel: channel})
  return props.actionButton
    ? <ActionButton onPress={onPress}> Add Post </ActionButton>
    : !props.hide && <LinkButton title="+ Post" onPress={onPress} />
}

const mapStateToProps = (state) => {
  const hasChannelsAndClubs = Object.keys(state.channels).length && Object.keys(state.clubs).length
  return { hide: !hasChannelsAndClubs }
}

export default connect(
  mapStateToProps, null
)(
  withDebouncedNav(NewPostButton)
)
