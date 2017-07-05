import React, { Component } from 'react'
import { View, Button, FlatList, StyleSheet, Text } from 'react-native'

import { get } from '../../lib/fetcher'

var styles = StyleSheet.create({
  list: {
    height: '100%'
  },
  channelItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    display: 'flex',
    alignItems: 'flex-start'
  },
  name: {
    flex: 1
  },
  details: {
    flex: 1,
    flexDirection: 'row'
  },
  club: {
    paddingLeft: 10,
    paddingRight: 10
  },
})

const ChannelItem = (props) => {
  return (
    <View style={styles.channelItem}>
      <View style={styles.name}>
        <Button
          onPress={() => props.navigate('Channel', {channel: props.channel, id: props.channel.id})}
          title={props.channel.name}
        />
      </View>
      <View style={styles.details}>
        <View style={styles.club}>
          <Text>In Club: Brain Food</Text>
        </View>
      </View>
    </View>
  )
}

class ChannelList extends Component {
  static navigationOptions = {
    title: 'Channels'
  }

  constructor(props) {
  	super(props)
  	this.state = {
  		channels: []
  	}
  }

  componentDidMount() {
  	get('/channels').then((data) => {
  		this.setState({
  			channels: data["data"]
  		})
  	})
  }

  renderChannelLink = (datum) => {
    const { navigate } = this.props.navigation
    return <ChannelItem navigate={navigate} channel={datum.item} />
  }

  render() {
    return (
      <View style={styles.list}>
        <FlatList
          data={this.state.channels}
          renderItem={this.renderChannelLink}
          keyExtractor={(item) => item.id}
        />
      </View>
    )
  }
}

export default ChannelList
