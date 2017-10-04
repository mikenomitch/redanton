import React from 'react'
import { View } from 'react-native'
import { Hoshi } from 'react-native-textinput-effects'

import { font, spacing, colors } from '../styleConstants'

import ErrorText from './ErrorText'

const BasicTextInput = (props) => {
  return (
    <View>
      <Hoshi
        {...props}
        style={{marginTop: spacing.large}}
        backgroundColor={'transparent'}
        labelStyle={{fontSize: font.medium, color: colors.mediumGray}}
        inputStyle={{fontSize: font.medium, fontWeight: font.lightWeight, color: colors.darkGray}}
        borderColor={colors.primary}
      />
      <ErrorText error={props.error} />
    </View>
  )
}

export default BasicTextInput
