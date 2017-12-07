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

const LinkButton = (props) => (
  <TouchableOpacity {...props}>
    <Text style={styles.title}>
      {props.title}
    </Text>
  </TouchableOpacity>
)

export default LinkButton
