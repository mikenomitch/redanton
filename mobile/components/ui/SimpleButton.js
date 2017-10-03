import React from 'react'

import Button from 'apsl-react-native-button'

import { colors } from '../styleConstants'

// ===============
//     STYLES
// ===============

const styles = {
  backgroundColor: 'transparent',
  borderColor: 'transparent',
  borderRadius: 0,
  borderWidth: 0
}

const SimpleButton = (props) => (
  <Button
    {...props}
    textStyle={{color: colors.primary}}
    style={styles}
  />
)

export default SimpleButton
