import React from 'react'
import {
  Text,
  TouchableOpacity
} from 'react-native'

import { colors, spacing } from '../styleConstants'

// ===============
//     STYLES
// ===============

const styles = {
  title: {
    fontSize: 18,
    color: colors.darkPrimary,
    textAlign: 'left',
    padding: spacing.medium
  }
}

const LinkButton = (props) => {
  const titleStyleOverrides = props.size === 'small'
    ? { fontSize: 14, padding: 3 }
    : {}

  const titleStyle = Object.assign({}, styles.title, titleStyleOverrides)

  return (
    <TouchableOpacity {...props}>
      <Text style={titleStyle}>
        {props.title}
      </Text>
    </TouchableOpacity>
  )
}

export default LinkButton
