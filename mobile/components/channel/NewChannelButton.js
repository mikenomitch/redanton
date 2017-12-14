import React from 'react'
import LinkButton from '../ui/LinkButton'
import ActionButton from '../ui/ActionButton'
import withDebouncedNav from '../helpers/withDebouncedNav'

const NewChannelButton = (props) => {
  const onPress = () => props.debouncedNav('NewChannel', {clubId: props.clubId})
  return props.actionButton
    ? <ActionButton onPress={onPress}> Add Channel </ActionButton>
    : <LinkButton title="+ Channel" onPress={onPress} />
}

export default withDebouncedNav(NewChannelButton)
