import React, { Component } from 'react'
import {
  Text,
  View
} from 'react-native'
import omit from 'lodash/omit'

import TagInput from 'react-native-tag-input'

import { border, colors } from '../styleConstants'

class EditPostInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tagText: ''
    }
  }

  onChange = (tagNames) => {
    this.props.onChange(tagNames)
  }

  textChange = (tagText) => {
    if (tagText[tagText.length - 1] == ",") {
      this.makeTag(tagText.slice(0, -1))
    }

    this.setState({ tagText })
  }

  makeTag = (text) => {
    const oldTags = this.props.value
    const newTags = oldTags.concat([text])

    this.onChange(newTags)

    setTimeout(
      () => {this.setState({ tagText: ''})}, 0
    )
  }

  onSubmitEditing = ({nativeEvent}) => {
    this.makeTag(nativeEvent.text)
  }

  onBlur = ({nativeEvent}) => {
    this.makeTag(nativeEvent.text)
  }

  render () {
    const propsSansChange = omit(this.props, ['onChange'])

    return (
      <View style={{borderBottomWidth: border.width, borderBottomColor: colors.border}}>
        <TagInput
          {...propsSansChange}
          onChange={this.onChange}
          text={this.state.tagText}
          onChangeText={this.textChange}
          inputProps={{
            returnKeyType: 'go',
            placeholder: 'add tags...',
            onSubmitEditing: this.onSubmitEditing,
            onBlur: this.onBlur
          }}
        />
      </View>
    )
  }
}

export default EditPostInfo
