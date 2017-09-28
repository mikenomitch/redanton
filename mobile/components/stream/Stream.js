import React, { Component } from 'react'
import { View, Button, Text, FlatList, StyleSheet } from 'react-native'

// =============
//    STYLES
// =============

var styles = StyleSheet.create({
  stream: {
    height: '100%'
  },
  streamItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    display: 'inline-flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch'
  },
  streamItemLeft: {
    width: '80%',
    display: 'flex',
    alignItems: 'flex-start'
  },
  streamItemRight: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    flex: 1
  },
  details: {
    flex: 1,
    flexDirection: 'row'
  },
  channel: {
    paddingLeft: 10,
    paddingRight: 10
  },
  action: {
    paddingLeft: 10,
    paddingRight: 10
  },
  empty: {
    alignItems: 'center',
    padding: 50
  }
})

// =============
//   CHILDREN
// =============

const StreamItem = (props) => {
  const action = props.post.message_count == 1
    ? "posted by "
    : "message from "
  return (
    <View style={styles.streamItem}>
      <View style={styles.streamItemLeft}>
        <View style={styles.title}>
          <Button
            onPress={() => props.navigate('Post', {post: props.post})}
            title={props.post.title}
          />
        </View>
        <View style={styles.details}>
          <View style={styles.channel}>
            <Text>In Channel: {props.chanName}</Text>
          </View>
          <View style={styles.action}>
            <Text>{action}<Text>{props.actionUserName}</Text></Text>
          </View>
        </View>
      </View>
      <View style={styles.streamItemRight}>
        <Button
          onPress={() => props.navigate('PostChat', {post: props.post})}
          title="Chat >"
        />
      </View>
    </View>
  )
}

// =============
//     MAIN
// =============

class Stream extends Component {
  static defaultProps = {
    channels: {},
    users: {}
  }

  get hasNoConent () {
    return !this.props.content || this.props.content.length === 0
  }

  renderEmpty () {
    return (
      <View style={styles.empty}>
        <Text> There's nothing here </Text>
        <Text> Add a post to get started. </Text>
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
      <View style={styles.stream}>
        <FlatList
          data={this.props.content}
          renderItem={this.renderPostLink}
          keyExtractor={(item) => item.id}
        />
      </View>
    )
  }
}

export default Stream
