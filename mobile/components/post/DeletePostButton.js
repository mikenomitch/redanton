import React from 'react'
import { Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import { colors, misc } from '../styleConstants'

import { confirmMessage } from '../../lib/uiActions'
import SimpleButton from '../ui/SimpleButton'

const DeletePostButton = (props) => {
  const onPress = () => {
    confirmMessage('Remove Post', 'Are you sure?', props.removePost)
  }

  return (
    <SimpleButton onPress={onPress} >
      Remove Post
    </SimpleButton>
  )
}

export default DeletePostButton
