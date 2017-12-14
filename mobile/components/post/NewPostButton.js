import React from 'react'
import LinkButton from '../ui/LinkButton'
import ActionButton from '../ui/ActionButton'
import withDebouncedNav from '../helpers/withDebouncedNav'

const NewPostButton = (props) => {
  const channel = props.navigation.state.params && props.navigation.state.params.channel
  const onPress = () => props.debouncedNav('NewPost', {channel: channel})
  return props.actionButton
    ? <ActionButton onPress={onPress}> Add Post </ActionButton>
    : <LinkButton title="+ Post" onPress={onPress} />
}

export default withDebouncedNav(NewPostButton)
