import React, { PureComponent } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl
} from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'

import { border, colors, spacing } from '../styleConstants'

import withDebouncedNav from '../helpers/withDebouncedNav'
import Loading from '../ui/Loading'
import LinkButton from '../ui/LinkButton'

import NeedClubPrompt from '../club/NeedClubPrompt'
import NeedChannelPrompt from '../channel/NeedChannelPrompt'

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
  const activityAgo = moment(new Date(props.channel.activity_at)).fromNow()

  return (
    <View style={styles.channelItem}>
      <View style={styles.name}>
        <LinkButton
          onPress={() => props.debouncedNav('Channel', {channel: props.channel, id: props.channel.id})}
          title={props.channel.name}
        />
      </View>
      <View style={styles.details}>
        <View style={styles.club}>
          <Text>latest activity: {activityAgo}</Text>
          <Text>club: {props.club.name}</Text>
          <Text>posts: {props.channel.post_count}</Text>
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

  get needsChannels() {
    return Object.values(this.props.channels).length === 0
  }

  get needsClubs() {
    return Object.values(this.props.clubs).length === 0
  }

  renderNoClubs () {
    return <NeedClubPrompt navigation={this.props.navigation} />
  }

  renderNoChannels () {
    return <NeedChannelPrompt navigation={this.props.navigation} />
  }

  render() {
    if (!this.props.firstLoadComplete) { return <Loading /> }
    if (this.needsClubs) { return this.renderNoClubs() }
    if (this.needsChannels) { return this.renderNoChannels() }

    return (
      <FlatList
        style={styles.list}
        initialNumToRender={10}
        data={this.props.channels}
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
