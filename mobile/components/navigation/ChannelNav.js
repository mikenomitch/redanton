import React from 'react'
import {
  Text, View, Button
} from 'react-native'
import { StackNavigator } from 'react-navigation'

class ClubsScreen extends React.Component {
  static navigationOptions = {
    title: 'Clubs',
  }

  render() {
    const { navigate } = this.props.navigation
    return (
      <View>
        <Text>This is the clubs list</Text>
        <Button
          onPress={() => navigate('Club')}
          title="See Club"
        />
      </View>
    )
  }
}

class ClubScreen extends React.Component {
  static navigationOptions = {
    title: 'Club',
  }

  render() {
    const { navigate } = this.props.navigation
    return (
      <View>
        <Text>This is a club</Text>
      </View>
    )
  }
}

const ClubNavigator = StackNavigator({
  Home: { screen: ClubsScreen },
  Club: { screen: ClubScreen },
})

export default ClubNavigator