import React, { Component } from 'react'
import { View, Button, FlatList } from 'react-native'

import { get } from '../../lib/fetcher'

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
    return (
      <Button
        onPress={() => navigate('Channel', {channel: datum.item})}
        title={datum.item.name}
      />
    )
  }

  render() {
    return (
      <View>
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
