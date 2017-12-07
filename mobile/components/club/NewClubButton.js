import React from 'react'
import LinkButton from '../ui/LinkButton'
import withDebouncedNav from '../helpers/withDebouncedNav'

const NewClubButton = (props) => {
  const onPress = () => props.debouncedNav('NewClub')
  return <LinkButton title="+ Club" onPress={onPress} />
}

export default withDebouncedNav(NewClubButton)
