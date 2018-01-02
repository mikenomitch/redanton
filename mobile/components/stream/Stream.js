import React, { PureComponent } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator
} from 'react-native'
import moment from 'moment'
import debounce from 'lodash/debounce'
import { WebBrowser } from 'expo'

import { border, colors, spacing, misc } from '../styleConstants'

import withDebouncedNav from '../helpers/withDebouncedNav'

import EditPostButton from '../post/EditPostButton'
import NeedPostPrompt from '../post/NeedPostPrompt'

import Icon from 'react-native-vector-icons/FontAwesome'
import SimpleButton from '../ui/SimpleButton'
import LinkButton from '../ui/LinkButton'

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
  loadingThrobber: {
    flex: 1,
    padding: 15
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

class BaseStreamItem extends PureComponent {
  get userIsOwner() {
    return this.props.post.user_id === this.props.currentUserId
  }

  onLinkPress = () => {
    if (this.props.post.url) {
      WebBrowser.openBrowserAsync(__uriFromUrl(this.props.post.url))
    } else {
      this.navigateToChat()
    }
  }

  renderEdit () {
    if ( this.userIsOwner ) {
      return (
        <View>
          <EditPostButton navigation={this.props.navigation} post={this.props.post} />
        </View>
      )
    }
  }

  navigateToChat = () => {
    this.props.debouncedNav('PostChat', {post: this.props.post})
  }

  render () {
    const timeAgo = moment(new Date(this.props.post.last_activity_time)).fromNow()
    const actionText = this.props.post.message_count > 0
      ? `message from ${this.props.actionUserName} ${timeAgo}`
      : `posted ${timeAgo}`

    return (
      <View style={styles.streamItem}>
        <View style={styles.streamItemLeft}>
          <View style={styles.title}>
            <LinkButton
              onPress={this.onLinkPress}
              title={this.props.post.title}
            />
          </View>
          <View style={styles.details}>
            <View style={styles.info}>
              <Text>club: {this.props.clubName}</Text>
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
            <SimpleButton onPress={this.navigateToChat} >
              <Icon name="comment" size={misc.iconSize} color={colors.primary} />
            </SimpleButton>
          </View>
        </View>
      </View>
    )
  }
}

const StreamItem = withDebouncedNav(BaseStreamItem)

// =============
//     MAIN
// =============

class Stream extends PureComponent {
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

  _onRefresh() {
    this.setState({refreshing: true})

    this.props.refresh(
      () => {this.setState({refreshing: false})}
    )
  }

  renderNoPosts () {
    return (
      <NeedPostPrompt
        inClub={this.props.inClub}
        inChannel={this.props.inChannel}
        navigation={this.props.navigation}
      />
    )
  }

  renderPostLink = (datum) => {
    const { clubs, navigation, users } = this.props

    const poster = users[datum.item.user_id] || {}
    const club = clubs[datum.item.club_id] || {}
    const user_id = datum.item.last_message && datum.item.last_message.user_id || datum.item.user_id
    const actionUser = users[user_id] || {}

    return (
      <StreamItem
        currentUserId={this.props.currentUserId}
        navigation={navigation}
        post={datum.item}
        actionUserName={actionUser.name}
        posterName={poster.name}
        clubName={club.name}/>
    )
  }

  onEndReached = () => {
    this.props.onEndHit && this.props.onEndHit()
  }

  render() {
    if (this.props.needsPosts) return this.renderNoPosts()

    return (
      <FlatList
        style={styles.stream}
        initialNumToRender={10}
        data={this.props.content}
        renderItem={this.renderPostLink}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={0.2}
        keyExtractor={(item) => item.id}
        ListFooterComponent={() => {
          return (
            this.props.currentlyLoading && (
            <View style={styles.loadingThrobber}>
              <ActivityIndicator size="small" />
            </View>
            ) || null
          );
        }}
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
