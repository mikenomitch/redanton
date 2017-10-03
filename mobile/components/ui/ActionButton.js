import React from 'react'
import Button from 'apsl-react-native-button'

import { border, colors, spacing } from '../styleConstants'

// ===============
//     STYLES
// ===============

const styles = {
  marginTop: spacing.extraLarge,
  borderColor: colors.primary,
  backgroundColor: colors.primary,
  borderRadius: 0,
  borderWidth: border.thickWidth
}

const ActionButton = (props) => (
  <Button
    {...props}
    textStyle={{color: colors.white}}
    style={styles}
  />
)

export default ActionButton
