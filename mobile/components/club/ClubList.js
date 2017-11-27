import React, { PureComponent } from 'react'
import {
  Button,
  StyleSheet,
  View,
  FlatList,
  RefreshControl
} from 'react-native'
import { connect } from 'react-redux'

import {colors, spacing, border} from '../styleConstants'

import Loading from '../ui/Loading'
import withDebouncedNav from '../helpers/withDebouncedNav'

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
  clubItem: {
    borderBottomWidth: border.width,
    borderBottomColor: colors.border,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 60
  }
})

// ===============
//     CHILDREN
// ===============

const BaseClubItem = (props) => {
  return (
    <View style={styles.clubItem}>
      <Button
        onPress={() => props.debouncedNav('Club', {club: props.club, id: props.club.id})}
        title={props.club.name}
      />
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

  render() {
    if (!this.props.firstLoadComplete) {
      <Loading />
    }

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
