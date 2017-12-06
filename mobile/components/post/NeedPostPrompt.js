import React from 'react'
import { View, Text } from 'react-native'

import withDebouncedNav from '../helpers/withDebouncedNav'
import { spacing } from '../styleConstants'

import NewPostButton from './NewPostButton'

const styles = {
  root: {
    alignItems: 'center',
    padding: spacing.container
  }
}

const NeedPostPrompt = (props) => (
  <View style={styles.root}>
    <Text> There's nothing here. </Text>
    <Text> Add a post to get started. </Text>
    <NewPostButton navigation={props.navigation}/>
  </View>
)

export default withDebouncedNav(NeedPostPrompt)