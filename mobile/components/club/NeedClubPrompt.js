import React from 'react'
import { View, Text } from 'react-native'

import withDebouncedNav from '../helpers/withDebouncedNav'
import { spacing } from '../styleConstants'

import NewClubButton from './NewClubButton'

const styles = {
  root: {
    alignItems: 'center',
    padding: spacing.container
  }
}

const NeedClubPrompt = (props) => (
  <View style={styles.root}>
    <Text> There's nothing here. </Text>
    <Text> Add a post to get started. </Text>
    <NewClubButton navigation={props.navigation}/>
  </View>
)

export default withDebouncedNav(NeedClubPrompt)