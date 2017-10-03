import React from 'react'
import { Hoshi } from 'react-native-textinput-effects'

import { font, spacing, colors } from '../styleConstants'

const BasicTextInput = (props) => (
  <Hoshi {...props}
    style={{marginTop: spacing.large}}
    backgroundColor={'transparent'}
    labelStyle={{fontSize: font.medium, color: colors.mediumGray}}
    inputStyle={{fontSize: font.medium, fontWeight: font.lightWeight, color: colors.darkGray}}
    borderColor={colors.primary}
  />
)

export default BasicTextInput
