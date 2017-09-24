import React from 'react'

import {
  Text,
  TextInput,
  View
} from 'react-native'

const EditPostInfo = (props) => (
  <View>
    <Text> url: </Text>
    <TextInput
      style={{height: 60, fontSize: 18}}
      placeholder="url"
      keyboardType="url"
      autoCorrect={false}
      autoCapitalize="none"
      value={props.postInfo.url}
      returnKeyType="next"
      onChangeText={(url) => props.setPostState({url})}
    />

    <Text> title: </Text>
    <TextInput
      style={{height: 60, fontSize: 18}}
      placeholder="title"
      value={props.postInfo.title}
      returnKeyType="next"
      onChangeText={(title) => props.setPostState({title})}
    />
  </View>
)

export default EditPostInfo
