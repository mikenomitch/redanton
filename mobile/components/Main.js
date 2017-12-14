import React, { Component } from 'react'
import {
  View,
  Text
} from 'react-native'

import { connect } from 'react-redux'

import { loadInitialAuth } from '../data/auth'

import LoginOrSignUp from './user/LoginOrSignUp'
import MainNav from './navigation/MainNav'
import Intro from './intro/Intro'

// =============
//   PRESENTER
// =============

class Main extends Component {
  componentDidMount(){
    this.props.loadInitialAuth()
  }

  renderLoading () {
    return (
      <View>
        <Text> Loading! </Text>
      </View>
    )
  }

  renderLogin () {
    return <LoginOrSignUp />
  }

  renderMainApp () {
    return <MainNav />
  }

  renderWalkThru () {
    return <Intro />
  }

  render () {
    if (this.props.isLoading) {
      return this.renderLoading()
    }

    if (!this.props.jwt) {
      return this.renderLogin()
    }

    if (1 === 1) {
      return this.renderWalkThru()
    }

    return this.renderMainApp()
  }
}

// ===============
//   CONNECTION
// ===============

const mapStateToProps = (state) => {
  return {
    jwt: state.auth.jwt,
    isLoading: !state.auth.initialStateLoaded
  }
}

export default connect(
  mapStateToProps,
  { loadInitialAuth }
)(Main)
