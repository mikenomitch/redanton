import React from 'react'
import { Button } from 'react-native'

const NewChannelButton = (props) => (
  <Button title="Manage" onPress={() => props.navigation.navigate('ClubManagement', {club: props.club})} />
)

export default NewChannelButton
