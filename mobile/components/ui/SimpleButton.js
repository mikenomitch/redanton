import React from 'react'

import Button from 'apsl-react-native-button'

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
    textStyle={{color: '#007aff'}}
    style={styles}
  />
)

export default SimpleButton
