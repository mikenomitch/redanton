import React, {Component} from 'react'
import { Button, Text, View, StyleSheet } from 'react-native'

import { connect } from 'react-redux'

import { getClubs } from '../../data/clubs'

import BasicButton from '../ui/BasicButton'

// ============
//    STYLES
// ============

// TODO: DRY up with Channel
var styles = StyleSheet.create({
  clubItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
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
  membership: {
    paddingLeft: 10,
    paddingRight: 10
  },
})

// ===============
//    CHILDREN
// ===============

const ClubItem = (props) => {
  return (
    <Button
      onPress={() => props.navigate('Club', {club: props.club, id: props.club.id})}
      title={props.club.name}
    />
  )
}
    // <View style={styles.clubItem}>
    //   <View style={styles.name}>
    //   </View>
    //   <View style={styles.details}>
    //     <View style={styles.membership}>
    //       <Text>Admin</Text>
    //     </View>
    //   </View>
    // </View>

// ===============
//    PRESENTER
// ===============

class ClubList extends Component {
  componentDidMount() {
    this.props.getClubs()
  }

  renderClubLink = (club) => {
    const { navigate } = this.props.navigation
    return <ClubItem navigate={navigate} club={club} key={club.id} />
  }

  render() {
    return (
      <View>
        <View>
          <Text> Clubs: </Text>
        </View>
        <View>
          {this.props.clubs.map(this.renderClubLink)}
        </View>
        <View>
          <Button
            onPress={() => this.props.navigation.navigate('NewClub')}
            title="+ New Club"
          />
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
