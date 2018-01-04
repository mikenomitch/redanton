import React, { Component } from 'react'
import {
  Text,
  View
} from 'react-native'

import TagInput from 'react-native-tag-input'

import { border, colors } from '../styleConstants'

class EditPostInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tagText: ''
    }
  }

  textChange = (tagText) => {
    if (tagText[tagText.length - 1] == ",") {
      console.warn('called')
    }

    this.setState({ tagText })
  }

  render () {

    return (
      <View style={{    borderBottomWidth: border.width, borderBottomColor: colors.border}}>
        <TagInput
          {... this.props}
          text={this.state.tagText}
          onChangeText={this.textChange}
        />
      </View>
    )
  }
}

export default EditPostInfo
