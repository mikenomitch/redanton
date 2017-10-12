import React, { Component} from 'react'

import {
  View,
  Text
} from 'react-native'

import { connect } from 'react-redux'

import { loadInitialAuth } from '../data/auth'

import LoginOrSignUp from './user/LoginOrSignUp'
import MainNav from './navigation/MainNav'

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

  render () {
    if (this.props.isLoading) {
      return this.renderLoading()
    }

    if (!this.props.jwt) {
      return this.renderLogin()
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
