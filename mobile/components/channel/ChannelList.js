import React, { PureComponent } from 'react'
import {
  View,
  Button,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl
} from 'react-native'
import { connect } from 'react-redux'

import { border, colors, spacing } from '../styleConstants'

import withDebouncedNav from '../helpers/withDebouncedNav'
import Loading from '../ui/Loading'

import { getChannels } from '../../data/channels'
import { getClubs } from '../../data/clubs'
import { callsDone } from '../../data/calls'

// ============
//    STYLES
// ============

const styles = StyleSheet.create({
  list: {
    flex: 1
  },
  channelItem: {
    borderBottomWidth: border.width,
    borderBottomColor: colors.border,
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
    paddingLeft: spacing.medium,
    paddingRight: spacing.medium
  },
})

// ===============
//    CHILDREN
// ===============

const ChannelItemBase = (props) => {
  return (
    <View style={styles.channelItem}>
      <View style={styles.name}>
        <Button
          onPress={() => props.debouncedNav('Channel', {channel: props.channel, id: props.channel.id})}
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

const ChannelItem = withDebouncedNav(ChannelItemBase)

// ===============
//    PRESENTER
// ===============

class ChannelList extends PureComponent {
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
        navigation={navigation}
        channel={channel}
        club={club}
      />
    )
  }

  render() {
    const channelsList = Object.values(this.props.channels)

    if (!this.props.firstLoadComplete) {
      <Loading />
    }

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
    clubs: state.clubs,
    firstLoadComplete: callsDone(
      state,
      ['clubs', 'channels']
    )
  }
}

export default connect(
  mapStateToProps,
  { getChannels, getClubs }
)(ChannelList)
