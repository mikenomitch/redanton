import React from 'react'
import { View } from 'react-native'

import BasicTextInput from '../ui/BasicTextInput'

const EditPostInfo = (props) => (
  <View>
    <BasicTextInput
      label="title"
      value={props.postInfo.title}
      onChangeText={(title) => props.setPostState({title})}
    />
    <BasicTextInput
      label="url"
      keyboardType="url"
      value={props.postInfo.url}
      onChangeText={(url) => props.setPostState({url})}
      autoCapitalize="none"
      autoCorrect={false}
    />
  </View>
)

export default EditPostInfo
