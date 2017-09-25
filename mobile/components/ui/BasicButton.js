import React from 'react'

import Button from 'apsl-react-native-button'

const BasicButton = (props) => (
  <Button
    {...props}
    textStyle={{color: '#007aff'}}
    style={{
      marginTop: 25,
      borderColor: '#007aff',
      borderRadius: 0,
      borderWidth: 1.5
    }}
  />
)

export default BasicButton
