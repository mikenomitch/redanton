import React from 'react'
import { Button } from 'react-native'

const NewChannelButton = (props) => (
  <Button title="+ Channel" onPress={() => props.navigation.navigate('NewChannel', {clubId: props.clubId})} />
)

export default NewChannelButton
