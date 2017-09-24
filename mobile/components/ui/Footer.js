import React from 'react'
import { View } from 'react-native'

const Footer = (props) => (
  <View style={{
    width: '100%',
    height: '10%'
  }}>
    {props.children}
  </View>
)

export default Footer