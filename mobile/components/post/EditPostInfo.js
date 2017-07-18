import React from 'react'

import {
  TextInput,
  View
} from 'react-native'

const EditPostInfo = (props) => (
  <View>
    <TextInput
      style={{height: 60, fontSize: 18}}
      placeholder="url"
      keyboardType="url"
      autoCapitalize="none"
      value={props.postInfo.url}
      onChangeText={(url) => props.setPostState({url})}
    />

    <TextInput
      style={{height: 60, fontSize: 18}}
      placeholder="title"
      value={props.postInfo.title}
      onChangeText={(title) => props.setPostState({title})}
    />

    <TextInput
      style={{height: 60, fontSize: 18}}
      placeholder="description"
      multiline={true}
      numberOfLines={5}
      value={props.postInfo.description}
      onChangeText={(description) => props.setPostState({description})}
    />
  </View>
)

export default EditPostInfo
