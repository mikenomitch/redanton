import React, { Component } from 'react'
import {
  View,
  Button,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl
} from 'react-native'

import { connect } from 'react-redux'

import { getChannels } from '../../data/channels'
import { getClubs } from '../../data/clubs'

// ============
//    STYLES
// ============

const styles = StyleSheet.create({
  list: {
    flex: 1
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
          <Text>club: {props.club.name}</Text>
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

  constructor(props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  _onRefresh() {
    this.setState({refreshing: true})

    this.props.getChannels(
      () => {this.setState({refreshing: false})}
    )
  }

  componentDidMount() {
    this.props.getChannels()
    this.props.getClubs()
  }

  renderChannelLink = (datum) => {
    const { clubs, navigation } = this.props
    const channel = datum.item
    const club = clubs[channel.club_id] || {}

    return (
      <ChannelItem
        navigate={navigation.navigate}
        channel={channel}
        club={club}
      />
    )
  }

  render() {
    const channelsList = Object.values(this.props.channels)
    return (
      <FlatList
        style={styles.list}
        initialNumToRender={10}
        data={channelsList}
        renderItem={this.renderChannelLink}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
      />
    )
  }
}

// ===============
//   CONNECTION
// ===============

const mapStateToProps = (state) => {
  return {
    channels: Object.values(state.channels),
    clubs: state.clubs
  }
}

export default connect(
  mapStateToProps,
  { getChannels, getClubs }
)(ChannelList)
