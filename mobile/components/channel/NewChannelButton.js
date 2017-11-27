import React from 'react'
import { Button } from 'react-native'
import withDebouncedNav from '../helpers/withDebouncedNav'

const NewChannelButton = (props) => {
  const onPress = () => props.debouncedNav('NewChannel', {clubId: props.clubId})
  return <Button title="+ Channel" onPress={onPress} />
}

export default withDebouncedNav(NewChannelButton)
