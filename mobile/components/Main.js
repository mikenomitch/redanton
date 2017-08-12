import React from 'react'

import {
  View,
  Text
} from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { loadInitialAuth } from '../data/auth'

import Auth from './auth/Auth'
import MainNav from './navigation/MainNav'

class Main extends React.Component {
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
    return <Auth />
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

const mapStateToProps = (state) => {
  return {
    jwt: state.auth.jwt,
    isLoading: !state.auth.initialStateLoaded
  }
}

const mapDispatchToProps = (dispatch) => {
  return	{
    loadInitialAuth: bindActionCreators(loadInitialAuth, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)
