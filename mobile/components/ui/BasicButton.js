import React from 'react'

import Button from 'apsl-react-native-button'

// ===============
//     STYLES
// ===============

const styles = {
  marginTop: 25,
  borderColor: '#007aff',
  borderRadius: 0,
  borderWidth: 1.5
}

const BasicButton = (props) => (
  <Button
    {...props}
    textStyle={{color: '#007aff'}}
    style={styles}
  />
)

export default BasicButton
