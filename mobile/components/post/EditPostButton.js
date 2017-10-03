import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'

import { colors, misc } from '../styleConstants'

import SimpleButton from '../ui/SimpleButton'

const EditPostButton = (props) => {
  const onPress = () => props.navigate('EditPost', {postInfo: props.post})

  return (
    <SimpleButton onPress={onPress} >
      <Icon name="pencil" size={misc.iconSize} color={colors.primary} />
    </SimpleButton>
  )
}

export default EditPostButton
