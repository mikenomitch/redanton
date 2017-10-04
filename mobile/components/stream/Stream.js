import React, { Component } from 'react'
import {
  View,
  Button,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl
} from 'react-native'
import moment from 'moment'
import { WebBrowser } from 'expo'

import { border, colors, spacing, misc } from '../styleConstants'

import EditPostButton from '../post/EditPostButton'
import NewPostButton from '../post/NewPostButton'

import Icon from 'react-native-vector-icons/FontAwesome'
import SimpleButton from '../ui/SimpleButton'

// =============
//    STYLES
// =============

const styles = StyleSheet.create({
  stream: {
    height: '100%',
    flex: 1
  },
  streamItem: {
    borderBottomWidth: border.width,
    borderBottomColor: colors.border,
    display: 'inline-flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch'
  },
  streamItemLeft: {
    width: '75%',
    display: 'flex',
    alignItems: 'flex-start'
  },
  streamItemRight: {
    height: '100%',
    width: '25%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexWrap: 'nowrap'
  },
  title: {
    flex: 1
  },
  details: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column'
  },
  info: {
    flex: 1,
    paddingLeft: spacing.medium,
    paddingRight: spacing.medium
  },
  empty: {
    alignItems: 'center',
    padding: spacing.container
  }
})

// =============
//   CHILDREN
// =============

function __uriFromUrl (url) {
  return (!/^(?:f|ht)tps?\:\/\//.test(url))
  ? 'http://' + url
  : url
}

class StreamItem extends Component {
  get userIsOwner() {
    return this.props.post.user_id === this.props.currentUserId
  }

  onLinkPress = () => {
    if (this.props.post.url) {
      WebBrowser.openBrowserAsync(__uriFromUrl(this.props.post.url))
    } else {
      this.props.navigate('PostChat', {post: this.props.post})
    }
  }

  renderEdit () {
    if ( this.userIsOwner ) {
      return (
        <View>
          <EditPostButton navigate={this.props.navigate} post={this.props.post} />
        </View>
      )
    }
  }

  render () {
    const timeAgo = moment(new Date(this.props.post.last_activity_time)).fromNow()
    const actionText = this.props.post.message_count > 1
      ? `message from ${this.props.actionUserName} ${timeAgo}`
      : `posted ${timeAgo}`

    return (
      <View style={styles.streamItem}>
        <View style={styles.streamItemLeft}>
          <View style={styles.title}>
            <Button
              onPress={this.onLinkPress}
              title={this.props.post.title}
            />
          </View>
          <View style={styles.details}>
            <View style={styles.info}>
              <Text>channel: {this.props.chanName}</Text>
            </View>
            <View style={styles.info}>
              <Text>posted by: <Text>{this.props.posterName}</Text></Text>
            </View>
            <View style={styles.info}>
              <Text>{actionText}</Text>
            </View>
          </View>
        </View>
        <View style={styles.streamItemRight}>
          {this.renderEdit()}
          <View>
            <SimpleButton onPress={() => this.props.navigate('PostChat', {post: this.props.post})} >
              <Icon name="comment" size={misc.iconSize} color={colors.primary} />
            </SimpleButton>
          </View>
        </View>
      </View>
    )
  }
}

// =============
//     MAIN
// =============

class Stream extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  static defaultProps = {
    channels: {},
    users: {}
  }

  get hasNoConent () {
    return !this.props.content || this.props.content.length === 0
  }

  _onRefresh() {
    this.setState({refreshing: true})

    this.props.refresh(
      () => {this.setState({refreshing: false})}
    )
  }

  renderEmpty () {
    return (
      <View style={styles.empty}>
        <Text> There's nothing here </Text>
        <Text> Add a post to get started. </Text>
        <NewPostButton navigation={this.props.navigation}/>
      </View>
    )
  }

  renderPostLink = (datum) => {
    const { channels, navigation, users } = this.props

    const poster = users[datum.item.user_id] || {}
    const chan = channels[datum.item.channel_id] || {}
    const user_id = datum.item.last_message && datum.item.last_message.user_id || datum.item.user_id
    const actionUser = users[user_id] || {}

    return (
      <StreamItem
        currentUserId={this.props.currentUserId}
        navigate={navigation.navigate}
        post={datum.item}
        actionUserName={actionUser.name}
        posterName={poster.name}
        chanName={chan.name}/>
    )
  }

  render() {
    if (this.hasNoConent) return this.renderEmpty()

    return (
      <FlatList
        style={styles.stream}
        initialNumToRender={10}
        data={this.props.content}
        renderItem={this.renderPostLink}
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

export default Stream
