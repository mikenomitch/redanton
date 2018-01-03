import React, { PureComponent } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl
} from 'react-native'
import { connect } from 'react-redux'

import { border, colors, spacing } from '../styleConstants'

import withDebouncedNav from '../helpers/withDebouncedNav'
import Loading from '../ui/Loading'
import LinkButton from '../ui/LinkButton'

import NeedClubPrompt from '../club/NeedClubPrompt'
import NeedTagPrompt from '../tag/NeedTagPrompt'

import { getTags } from '../../data/tags'
import { getClubs } from '../../data/clubs'
import { callsDone } from '../../data/calls'

// ============
//    STYLES
// ============

const styles = StyleSheet.create({
  list: {
    flex: 1
  },
  tagItem: {
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
  info: {
    paddingLeft: spacing.medium,
    paddingRight: spacing.medium
  },
})

// ===============
//    CHILDREN
// ===============

const TagItemBase = (props) => {
  return (
    <View style={styles.tagItem}>
      <View style={styles.name}>
        <LinkButton
          onPress={() => props.debouncedNav('Tag', {tag: props.tag, id: props.tag.id})}
          title={props.tag.name}
        />
      </View>
      <View style={styles.details}>
        <View style={styles.info}>
          <Text>posts: {props.tag.post_count}</Text>
        </View>
      </View>
    </View>
  )
}

const TagItem = withDebouncedNav(TagItemBase)

// ===============
//    PRESENTER
// ===============

class TagList extends PureComponent {
  static navigationOptions = {
    title: 'Tags'
  }

  constructor(props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  _onRefresh() {
    this.setState({refreshing: true})

    this.props.getTags(
      () => {this.setState({refreshing: false})}
    )
  }

  componentDidMount() {
    this.props.getTags()
    this.props.getClubs()
  }

  renderTagLink = (datum) => {
    const { clubs, navigation } = this.props
    const channel = datum.item
    const club = clubs[channel.club_id] || {}

    return (
      <TagItem navigation={navigation} tag={tag} />
    )
  }

  get needsTags() {
    return Object.values(this.props.tags).length === 0
  }

  get needsClubs() {
    return Object.values(this.props.clubs).length === 0
  }

  renderNoClubs () {
    return <NeedClubPrompt navigation={this.props.navigation} />
  }

  renderNoTags () {
    return <NeedTagPrompt navigation={this.props.navigation} />
  }

  render() {
    if (!this.props.firstLoadComplete) { return <Loading /> }
    if (this.needsClubs) { return this.renderNoClubs() }
    if (this.needsTags) { return this.renderNoTags() }

    return (
      <FlatList
        style={styles.list}
        initialNumToRender={10}
        data={this.props.tags}
        renderItem={this.renderTagLink}
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
    tags: Object.values(state.tags),
    clubs: state.clubs,
    firstLoadComplete: callsDone(
      state,
      ['clubs', 'tags']
    )
  }
}

export default connect(
  mapStateToProps,
  { getTags, getClubs }
)(TagList)
