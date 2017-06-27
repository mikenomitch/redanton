import React from 'react';
import {
  AppRegistry,
  Text,
  View,
  Button,
} from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';

class StreamScreen extends React.Component {
  static navigationOptions = {
    title: 'Stream',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Text>Front Page!</Text>
        <Button
          onPress={() => navigate('Post')}
          title="See A Post"
        />
      </View>
    );
  }
}

class PostScreen extends React.Component {
  static navigationOptions = {
    title: 'Post',
  };

  render() {
    return (
      <View>
        <Text>Post</Text>
      </View>
    );
  }
}


class ClubsScreen extends React.Component {
  static navigationOptions = {
    title: 'Clubs',
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Text>This is the clubs list</Text>
        <Button
          onPress={() => navigate('Club')}
          title="See Club"
        />
      </View>
    );
  }
}

class ClubScreen extends React.Component {
  static navigationOptions = {
    title: 'Club',
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Text>This is a club</Text>
      </View>
    );
  }
}

class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };

  render() {
    return (
      <View>
        <Text>Hey Erik</Text>
      </View>
    );
  }
}

const StreamNavigator = StackNavigator({
  Home: { screen: StreamScreen },
  Post: { screen: PostScreen },
});

const ClubNavigator = StackNavigator({
  Home: { screen: ClubsScreen },
  Club: { screen: ClubScreen },
});

const Danton = TabNavigator({
  Stream: { screen: StreamNavigator },
  Clubs: { screen: ClubNavigator },
  Profile: { screen: ProfileScreen }
});

Danton.navigationOptions = {
  title: 'Danton',
};

export default Danton
