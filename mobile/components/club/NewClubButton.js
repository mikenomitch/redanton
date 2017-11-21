import React from 'react'
import { Button } from 'react-native'

const NewClubButton = (props) => (
  <Button title="+ Club" onPress={() => props.navigation.navigate('NewClub')} />
)

export default NewClubButton
