import React from 'react'
import { Button } from 'react-native'
import withDebouncedNav from '../helpers/withDebouncedNav'

const NewChannelButton = (props) => {
  const onPress = () => props.debouncedNav('ClubManagement', {club: props.club})
  return <Button title="Manage" onPress={onPress} />
}

export default withDebouncedNav(NewChannelButton)
