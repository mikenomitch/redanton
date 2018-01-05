import React, { Component } from 'react'
import {
  Text,
  View
} from 'react-native'

import BasicTextInput from '../ui/BasicTextInput'
import BasicTagInput from '../ui/BasicTagInput'

import { colors } from '../styleConstants'

class EditPostInfo extends Component {
  render () {
    return (
      <View>
        <BasicTextInput
          label="title"
          value={this.props.postInfo.title}
          onChangeText={(title) => this.props.setPostState({ title })}
          error={this.props.errorFor('title', this.props.postInfo.title)}
        />
        <BasicTextInput
          label="url"
          keyboardType="url"
          value={this.props.postInfo.url}
          onChangeText={(url) => this.props.setPostState({ url })}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={{color: colors.mediumGray, marginBottom: 14}} >
          leave url blank for discussion post
        </Text>
        <BasicTagInput
          value={this.props.postInfo.tagNames || ['econ', 'politics']}
          onChange={(tagNames) => this.props.setPostState({ tagNames })}
          labelExtractor={(email) => email}
        />
      </View>
    )
  }
}

export default EditPostInfo
