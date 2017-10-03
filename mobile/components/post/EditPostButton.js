import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'

import SimpleButton from '../ui/SimpleButton'

const EditPostButton = (props) => {
  const onPress = () => props.navigate('EditPost', {postInfo: props.post})

  return (
    <SimpleButton onPress={onPress} >
      <Icon name="pencil" size={20} color="#007aff" />
    </SimpleButton>
  )
}

export default EditPostButton
