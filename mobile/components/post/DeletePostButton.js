import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'

import { confirmMessage } from '../../lib/uiActions'
import SimpleButton from '../ui/SimpleButton'

const DeletePostButton = (props) => {
  const onPress = () => {
    confirmMessage('Remove Post', 'Are you sure?', props.removePost)
  }

  return (
    <SimpleButton onPress={onPress} >
      <Icon name="trash" size={20} color="#007aff" />
    </SimpleButton>
  )
}

export default DeletePostButton