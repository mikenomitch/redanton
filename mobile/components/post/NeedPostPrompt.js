import React from 'react'
import { View, Text } from 'react-native'

import withDebouncedNav from '../helpers/withDebouncedNav'
import { font, spacing } from '../styleConstants'

import NewPostButton from './NewPostButton'

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

const NeedPostPrompt = (props) => {
  if (props.inClub) {
    return (
      <View style={styles.root}>
        <Text style={styles.textHeader}> This club has no posts! </Text>
        <Text style={styles.text}> Add a post to get started. </Text>
        <NewPostButton navigation={props.navigation}/>
      </View>
    )
  }

  if (props.inChannel) {
    return (
      <View style={styles.root}>
        <Text style={styles.textHeader}> This channel has no Posts! </Text>
        <Text style={styles.text}> Add a post to get started. </Text>
        <NewPostButton navigation={props.navigation}/>
      </View>
    )
  }

  return (
    <View style={styles.root}>
      <Text style={styles.textHeader}> You have no Posts! </Text>
      <Text style={styles.text}> Add a post to get started. </Text>
      <NewPostButton navigation={props.navigation}/>
    </View>
  )
}

export default withDebouncedNav(NeedPostPrompt)
