import React from 'react'

import Button from 'apsl-react-native-button'

// ===============
//     STYLES
// ===============

const styles = {
  marginTop: 25,
  borderColor: '#007aff',
  backgroundColor: '#007aff',
  borderRadius: 0,
  borderWidth: 1.5
}

const ActionButton = (props) => (
  <Button
    {...props}
    textStyle={{color: 'white'}}
    style={styles}
  />
)

export default ActionButton
