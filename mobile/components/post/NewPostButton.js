import React from 'react'
import LinkButton from '../ui/LinkButton'
import withDebouncedNav from '../helpers/withDebouncedNav'

const NewPostButton = (props) => {
  const channel = props.navigation.state.params && props.navigation.state.params.channel
  const onPress = () => props.debouncedNav('NewPost', {channel: channel})
  return <LinkButton title="+ Post" onPress={onPress} />
}

export default withDebouncedNav(NewPostButton)
