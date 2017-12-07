import React from 'react'
import LinkButton from '../ui/LinkButton'
import withDebouncedNav from '../helpers/withDebouncedNav'

const NewChannelButton = (props) => {
  const onPress = () => props.debouncedNav('NewChannel', {clubId: props.clubId})
  return <LinkButton title="+ Channel" onPress={onPress} />
}

export default withDebouncedNav(NewChannelButton)
