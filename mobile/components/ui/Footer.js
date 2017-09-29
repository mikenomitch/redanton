import React from 'react'
import {
  StyleSheet,
  View
} from 'react-native'

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '10%'
  }
})

const Footer = (props) => (
  <View style={styles.root}>
    {props.children}
  </View>
)

export default Footer