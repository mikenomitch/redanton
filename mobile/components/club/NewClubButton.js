import React from 'react'
import { Button } from 'react-native'
import withDebouncedNav from '../helpers/withDebouncedNav'

const NewClubButton = (props) => {
  const onPress = () => props.debouncedNav('NewClub')
  return <Button title="+ Club" onPress={onPress} />
}

export default withDebouncedNav(NewClubButton)
