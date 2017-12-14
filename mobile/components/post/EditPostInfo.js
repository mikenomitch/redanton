import React from 'react'
import {
  Text,
  View
} from 'react-native'

import BasicTextInput from '../ui/BasicTextInput'
import { colors } from '../styleConstants'

const EditPostInfo = (props) => (
  <View>
    <BasicTextInput
      label="title"
      value={props.postInfo.title}
      onChangeText={(title) => props.setPostState({title})}
      error={props.errorFor('title', props.postInfo.title)}
    />
    <BasicTextInput
      label="url"
      keyboardType="url"
      value={props.postInfo.url}
      onChangeText={(url) => props.setPostState({url})}
      autoCapitalize="none"
      autoCorrect={false}
    />
    <Text style={{color: colors.mediumGray}} >
      leave url blank for discussion post
    </Text>
  </View>
)

export default EditPostInfo
