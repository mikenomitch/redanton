import React from 'react'

import {
  StyleSheet,
  View,
  Image
} from 'react-native'

const styles = StyleSheet.create({
  image: {
    borderRadius: 100,
    height: 50,
    width: 50
  },
  letters: {
    backgroundColor: '#ddd',
    borderRadius: 100,
    height: 50,
    width: 50
  }
})

const Avatar = (props) => {
  const user = props.user
  if (user.avatar) {
    return (
      <Image
        style={styles.image}
        source={{uri: this.props.currentUser.avatar}}
      />
    )
  }

  const stringToSplit = user.name || user.email || '?'
  const firstLetter = stringToSplit[0]

  return (
    <View style={styles.letters}>
      {firstLetter}
    </View>
  )
}

export default Avatar
