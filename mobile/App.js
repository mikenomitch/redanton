import React from 'react';
import {
  AppRegistry,
  Image,
  Text,
  View,
  Button,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';

import {
  Accelerometer,
} from 'expo';

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
        <AccelerometerSensor/>
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
    // http://mlb.mlb.com/mlb/images/players/head_shot/116539.jpg
    let pic = {
      uri: 'https://scontent.ford1-1.fna.fbcdn.net/v/t1.0-9/1012800_2840495368468_1219514545_n.jpg?oh=2c7042c24ba884d1be7b2ed906e498e9&oe=59C8C060'
    };

    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Image source={pic} style={{width: 193, height: 210, marginTop: 100}}/>
        <Text>This is Erik</Text>
      </View>
    );
  }
}

class AccelerometerSensor extends React.Component {
  state = {
    accelerometerData: {},
  }

  componentDidMount() {
    this._toggle();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this._subscribe();
    }
  }

  _slow = () => {
    Accelerometer.setUpdateInterval(1000);
  }

  _fast = () => {
    Accelerometer.setUpdateInterval(16);
  }

  _subscribe = () => {
    this._subscription = Accelerometer.addListener((result) => {
      this.setState({accelerometerData: result});
    });
  }

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  }

  render() {
    let { x, y, z } = this.state.accelerometerData;

    return (
      <View style={styles.sensor}>
        <Text>Accelerometer:</Text>
        <Text>x: {round(x)} y: {round(y)} z: {round(z)}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this._toggle} style={styles.button}>
            <Text>Toggle</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._slow} style={[styles.button, styles.middleButton]}>
            <Text>Slow</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._fast} style={styles.button}>
            <Text>Fast</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  sensor: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
});

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
