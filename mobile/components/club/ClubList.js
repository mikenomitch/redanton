import React, {Component} from 'react'
import {
  Button,
  Text,
  StyleSheet,
  View
} from 'react-native'
import { connect } from 'react-redux'

import {colors, spacing, border} from '../styleConstants'

import { getClubs } from '../../data/clubs'

import ActionButton from '../ui/ActionButton'

// ===============
//     STYLES
// ===============

const styles = StyleSheet.create({
  clubList: {
    paddingTop: spacing.medium
  },
  clubItem: {
    borderBottomWidth: border.width,
    borderBottomColor: colors.border,
    display: 'flex',
    alignItems: 'flex-start'
  },
  name: {
    flex: 1
  },
  newClubButtonHolder: {},
  newClubButton: {},
  listHolder: {
    display: 'flex',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  clubItem: {
    width: '100%',
    paddingTop: spacing.medium,
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

const ClubItem = (props) => {
  return (
    <View style={styles.clubItem}>
      <Button
        onPress={() => props.navigate('Club', {club: props.club, id: props.club.id})}
        title={props.club.name}
      />
    </View>
  )
}

// ===============
//    PRESENTER
// ===============

class ClubList extends Component {
  componentDidMount() {
    this.props.getClubs()
  }

  newClubPress = () => {
    this.props.navigation.navigate('NewClub')
  }

  renderClubLink = (club) => {
    const { navigate } = this.props.navigation
    return <ClubItem navigate={navigate} club={club} key={club.id} />
  }

  render() {
    return (
      <View style={styles.clubList}>
        <View style={styles.listHolder}>
          {this.props.clubs.map(this.renderClubLink)}
        </View>
        <View style={styles.newClubButtonHolder}>
          <ActionButton onPress={this.newClubPress}>
            + New Club
          </ActionButton>
        </View>
      </View>
    )
  }
}

// ===============
//   CONNECTION
// ===============

const mapStateToProps = (state) => {
  return {
    clubs: Object.values(state.clubs)
  }
}

export default connect(
  mapStateToProps,
  { getClubs }
)(ClubList)
