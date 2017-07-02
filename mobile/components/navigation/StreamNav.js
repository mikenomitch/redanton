import React from 'react'
import {
  Text, View, Button
} from 'react-native'
import { StackNavigator } from 'react-navigation'

class StreamScreen extends React.Component {
  static navigationOptions = {
    title: 'Stream',
  }

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

class PostScreen extends React.Component {
  static navigationOptions = {
    title: 'Post',
  }

  render() {
    return (
      <View>
        <Text>Post</Text>
      </View>
    )
  }
}

const StreamNavigator = StackNavigator({
  Home: { screen: StreamScreen },
  Post: { screen: PostScreen },
})

export default StreamNavigator