import React, {Component} from 'react'
import {
  Button,
  Text,
  StyleSheet,
  View
} from 'react-native'

import { connect } from 'react-redux'

import { getClubs } from '../../data/clubs'

import BasicButton from '../ui/BasicButton'

// ===============
//     STYLES
// ===============

const styles = StyleSheet.create({
  clubList: {
    paddingTop: 10
  },
  clubItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
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
    borderTopColor: '#ddd',
  },
  clubItem: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
          <BasicButton onPress={this.newClubPress}>
            + New Club
          </BasicButton>
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
