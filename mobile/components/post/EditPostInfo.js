import React from 'react'

import {
  Text,
  TextInput,
  View
} from 'react-native'

import { Hoshi } from 'react-native-textinput-effects'

const EditPostInfo = (props) => (
  <View>
    <Hoshi
      label="url"
      backgroundColor={'transparent'}
      labelStyle={{ color: 'black' }}
      borderColor={'black'}
      style={{marginTop: 10}}

      keyboardType="url"
      autoCorrect={false}
      autoCapitalize="none"
      value={props.postInfo.url}
      returnKeyType="next"
      onChangeText={(url) => props.setPostState({url})}
    />
    <Hoshi
      label="title"
      backgroundColor={'transparent'}
      labelStyle={{ color: 'black' }}
      borderColor={'black'}
      style={{marginTop: 10}}

      value={props.postInfo.title}
      returnKeyType="next"
      onChangeText={(title) => props.setPostState({title})}
    />
  </View>
)

export default EditPostInfo
