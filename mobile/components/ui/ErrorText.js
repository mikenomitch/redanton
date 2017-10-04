import React from 'react'
import { StyleSheet, Text } from 'react-native'

import { colors } from '../styleConstants'

const styles = StyleSheet.create({
  root: {
    color: colors.error
  }
})

const ErrorText = (props) => {
  if (!props.error) return null

  return <Text style={styles.root}> {props.error} </Text>
}


export default ErrorText