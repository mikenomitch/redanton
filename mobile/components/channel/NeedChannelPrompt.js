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
    alignItems: 'center',
    fontSize: font.extraLarge,
    fontWeight:font.heavyWeight,
    margin: spacing.small
  }
}

const NeedChannelPrompt = (props) => {
  if (props.inClub) {
    return (
      <View style={styles.root}>
        <Text style={styles.textHeader}> This club has no channels! </Text>
        <Text style={styles.text}> Channels can be about any topic you like: humor, politics, culture, entertainment, etc... </Text>
        <NewChannelButton navigation={props.navigation}/>
      </View>
    )
  } else {
    return (
      <View style={styles.root}>
        <Text style={styles.textHeader}> You have no channels! </Text>
        <Text style={styles.text}> Every time you post to Relayd, you broadcast to a channel. </Text>
        <Text style={styles.text}> Channels can be about any topic you like: humor, politics, culture, entertainment, etc... </Text>
        <NewChannelButton navigation={props.navigation}/>
      </View>
    )
  }
}

export default withDebouncedNav(NeedChannelPrompt)
