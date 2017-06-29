import React from 'react';
import {
  AppRegistry,
  Image,
  Text,
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';

import {
  Accelerometer,
} from 'expo';

import {Socket} from "phoenix"

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

class ChatScreen extends React.Component {
  static navigationOptions = {
    title: 'Chat',
  };

  constructor() {
    super()

    this.state = {
      messages: []
    }
  }

  componentDidMount() {
    let socket = new Socket("https://stormy-reef-53700.herokuapp.com/socket",)
    socket.connect()

    let channel = socket.channel("room:lobby", {})
    this.ch = channel

    channel.on("new_msg", payload => {
      let newMsg = this.state.messages.concat([payload.body])
      this.setState({messages: newMsg})
    })

    channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) })
  }

  dispatch = (text) => {
    this.ch.push("new_msg", {body: this.state.text})
    this.setState({text: ''})
  }

  render() {
    let pic = {
      uri: 'https://scontent.ford1-1.fna.fbcdn.net/v/t1.0-9/1012800_2840495368468_1219514545_n.jpg?oh=2c7042c24ba884d1be7b2ed906e498e9&oe=59C8C060'
    };

    return (
      <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 100}}>
        <Text> Simple Chat: </Text>
        {this.state.messages.map((m, i) => <Text key={i}>{m}</Text>)}
        <TextInput onChangeText={this.dispatch} /><TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => {this.setState({text})}}
          onSubmitEditing={this.dispatch}
          value={this.state.text}
        />
      </View>
    );
  }
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
  Chat: { screen: ChatScreen }
});

Danton.navigationOptions = {
  title: 'Danton',
};

export default Danton
