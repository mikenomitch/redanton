import React from 'react'
import { View, Text } from 'react-native'

import withDebouncedNav from '../helpers/withDebouncedNav'
import { font, spacing } from '../styleConstants'

import NewClubButton from './NewClubButton'

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
    fontWeight: font.heavyWeight,
    margin: spacing.small
  }
}

const NeedClubPrompt = (props) => (
  <View style={styles.root}>
    <Text style={styles.textHeader}> You have no clubs! </Text>
    <Text style={styles.text}> Clubs are groups of people you share links with. </Text>
    <Text style={styles.text}> For Relayd to be useful, make your first club. </Text>
    <NewClubButton navigation={props.navigation}/>
  </View>
)

export default withDebouncedNav(NeedClubPrompt)
