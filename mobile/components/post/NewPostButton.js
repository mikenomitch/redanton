import React from 'react'
import { Button } from 'react-native'

const NewPostButton = (props) => {
  const channel = props.navigation.state.params && props.navigation.state.params.channel
  return <Button title="+ Post" onPress={() => props.navigation.navigate('NewPost', {channel: channel})} />
}

export default NewPostButton
