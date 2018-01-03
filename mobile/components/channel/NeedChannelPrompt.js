import React from 'react'
import { View, Text } from 'react-native'

import withDebouncedNav from '../helpers/withDebouncedNav'
import { font, spacing } from '../styleConstants'

import NewChannelButton from './NewChannelButton'

const styles = {
  root: {
    alignItems: 'center',
    padding: spacing.container
  },
  text: {
    alignItems: 'center',
    textAlign: 'center',
    margin: spacing.small
  },
  textHeader: {
    textAlign: 'center',
    fontSize: font.extraLarge,
    fontWeight:font.heavyWeight,
    margin: spacing.small
  }
}

const NeedChannelPrompt = (props) => {
  const titleText = props.inClub
    ? 'This club has no tags!'
    : 'You have no tags!'

  return (
    <View style={styles.root}>
      <Text style={styles.textHeader}> {titleText} </Text>
      <Text style={styles.text}> Every time you post to Relayd, you can add tags to help categorize the post. </Text>
      <Text style={styles.text}> Tags can be about any topic you like: humor, politics, culture, entertainment, etc... </Text>
      <NewChannelButton actionButton navigation={props.navigation}/>
    </View>
  )
}

export default withDebouncedNav(NeedChannelPrompt)
