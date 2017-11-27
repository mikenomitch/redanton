import React from 'react'
import { Button } from 'react-native'
import withDebouncedNav from '../helpers/withDebouncedNav'

const NewPostButton = (props) => {
  const channel = props.navigation.state.params && props.navigation.state.params.channel
  const onPress = () => props.debouncedNav('NewPost', {channel: channel})
  return <Button title="+ Post" onPress={onPress} />
}

export default withDebouncedNav(NewPostButton)
