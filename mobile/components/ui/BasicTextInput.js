import React from 'react'
import { Hoshi } from 'react-native-textinput-effects'

const BasicTextInput = (props) => (
  <Hoshi {...props}
    style={{marginTop: 15}}
    backgroundColor={'transparent'}
    labelStyle={{fontSize: 14, color: '#666'}}
    inputStyle={{fontSize: 14, fontWeight: '100', color: '#333'}}
    borderColor={'#007aff'}
  />
)

export default BasicTextInput
