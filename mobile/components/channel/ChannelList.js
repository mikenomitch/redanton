import React, { Component } from 'react'
import { View, Button, FlatList, StyleSheet, Text } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getChannels } from '../../data/channels'

// ============
//    STYLES
// ============

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

// ===============
//    CHILDREN
// ===============

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

// ===============
//    PRESENTER
// ===============

class ChannelList extends Component {
  static navigationOptions = {
    title: 'Channels'
  }

  componentDidMount() {
  	this.props.getChannels()
  }

  renderChannelLink = (datum) => {
    const { navigate } = this.props.navigation
    return <ChannelItem navigate={navigate} channel={datum.item} />
  }

  render() {
    const channelsList = Object.values(this.props.channels)
    return (
      <View style={styles.list}>
        <FlatList
          data={channelsList}
          renderItem={this.renderChannelLink}
          keyExtractor={(item) => item.id}
        />
      </View>
    )
  }
}

// ===============
//   CONNECTION
// ===============

const mapStateToProps = (state) => {
  return {
    channels: Object.values(state.channels)
  }
}

const mapDispatchToProps = (dispatch) => {
  return	{
    getChannels: bindActionCreators(getChannels, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelList)
