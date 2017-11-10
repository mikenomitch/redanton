import React from 'react'
import { ActivityIndicator, View, StyleSheet } from 'react-native'

import { spacing } from '../styleConstants'

const styles = StyleSheet.create({
  root: {
    margin: spacing.container
  }
})

export default () => (
  <View style={styles.root}>
    <ActivityIndicator size="large" />
  </View>
)
