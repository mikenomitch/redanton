import React, { PureComponent } from 'react'
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  Text
} from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'

import {colors, spacing, border} from '../styleConstants'

import withDebouncedNav from '../helpers/withDebouncedNav'

import LinkButton from '../ui/LinkButton'
import Loading from '../ui/Loading'
import NeedClubPrompt from '../club/NeedClubPrompt'

import { getClubs } from '../../data/clubs'
import { callsDone } from '../../data/calls'

// ===============
//     STYLES
// ===============

const styles = StyleSheet.create({
  clubList: {
    paddingTop: spacing.medium
  },
  name: {
    flex: 1
  },
  list: {
    flex: 1
  },
  details: {
    flex: 1,
    flexDirection: 'row'
  },
  counts: {
    paddingLeft: spacing.medium,
    paddingRight: spacing.medium
  },
  clubItem: {
    borderBottomWidth: border.width,
    borderBottomColor: colors.border,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center'
  }
})

// ===============
//     CHILDREN
// ===============

const BaseClubItem = (props) => {
  const activityAgo = moment(new Date(props.club.activity_at)).fromNow()

  return (
    <View style={styles.clubItem}>
      <View style={styles.name}>
        <LinkButton
          onPress={() => props.debouncedNav('Club', {club: props.club, id: props.club.id})}
          title={props.club.name}
        />
      </View>
      <View style={styles.details}>
        <View style={styles.counts}>
          <Text>last activity: {activityAgo}</Text>
          <Text>posts: {props.club.post_count}</Text>
        </View>
      </View>
    </View>
  )
}

const ClubItem = withDebouncedNav(BaseClubItem)

// ===============
//    PRESENTER
// ===============

class ClubList extends PureComponent {
  componentDidMount() {
    this.props.getClubs()
  }

  constructor(props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  get needsClubs() {
    return Object.values(this.props.clubs).length === 0
  }

  newClubPress = () => {
    this.props.navigation.navigate('NewClub')
  }

  renderClubLink = (datum) => {
    const club = datum.item

    return <ClubItem navigation={this.props.navigation} club={club} key={club.id} />
  }

  _onRefresh() {
    this.setState({refreshing: true})

    this.props.getClubs(
      () => {this.setState({refreshing: false})}
    )
  }

  renderNoClubs () {
    return <NeedClubPrompt navigation={this.props.navigation} />
  }

  render() {
    if (!this.props.firstLoadComplete) { <Loading /> }
    if (this.needsClubs) { return this.renderNoClubs() }

    return (
      <FlatList
        style={styles.list}
        initialNumToRender={10}
        data={this.props.clubs}
        renderItem={this.renderClubLink}
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
    clubs: Object.values(state.clubs),
    firstLoadComplete: callsDone(
      state,
      ['clubs']
    )
  }
}

export default connect(
  mapStateToProps,
  { getClubs }
)(ClubList)
