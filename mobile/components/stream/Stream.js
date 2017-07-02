import React from 'react'
import { Text, View, Button } from 'react-native'

class Stream extends React.Component {
  render() {
    const { navigate } = this.props.navigation

    return (
      <View>
        <Text>Front Page!</Text>
        <Button
          onPress={() => navigate('Post')}
          title="See A Post!"
        />
      </View>
    )
  }
}

export default Stream