import React from 'react'
import LinkButton from '../ui/LinkButton'
import ActionButton from '../ui/ActionButton'
import withDebouncedNav from '../helpers/withDebouncedNav'

const NewClubButton = (props) => {
  const onPress = () => props.debouncedNav('NewClub')
  return props.actionButton
    ? <ActionButton onPress={onPress}> Add Club </ActionButton>
    : <LinkButton title="+ Club" onPress={onPress} />
}

export default withDebouncedNav(NewClubButton)
