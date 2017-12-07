import React from 'react'
import LinkButton from '../ui/LinkButton'
import withDebouncedNav from '../helpers/withDebouncedNav'

const NewChannelButton = (props) => {
  const onPress = () => props.debouncedNav('ClubManagement', {club: props.club})
  return <LinkButton title="Manage" onPress={onPress} />
}

export default withDebouncedNav(NewChannelButton)
