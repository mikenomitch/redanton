import React, { Component } from 'react'
import {
  Text,
  View
} from 'react-native'

import BasicTextInput from '../ui/BasicTextInput'
import BasicTagInput from '../ui/BasicTagInput'

import { colors } from '../styleConstants'

class EditPostInfo extends Component {
  get tagNamesArray() {
    const tagsStr = this.props.postInfo.tagNames || ''
    console.warn(tagsStr)
    return tagsStr ? tagsStr.split(",") : []
  }

  parseTagNamesArray = (tagNamesList) => {
    return tagNamesList.join(",")
  }

  onTagInputChange = (tagNamesList) => {
    this.props.setPostState({ tagNames: this.parseTagNamesArray(tagNamesList) })
  }

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
          value={this.tagNamesArray}
          onChange={this.onTagInputChange}
          labelExtractor={(v) => v}
        />
        <Text> wat </Text>
      </View>
    )
  }
}

export default EditPostInfo
