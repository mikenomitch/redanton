import React from 'react'

import {
	AsyncStorage,
  View,
  Text
} from 'react-native'

import { post } from '../lib/fetcher'

import Auth from './auth/Auth'
import MainNav from './navigation/MainNav'

class Main extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      isLoading: true,
      jwt: undefined
    }
  }

  getInfo () {
    post('/api_login/v1', {}, {useNonApi: true}).then( (data) => {
      AsyncStorage.setItem('jwt', data.jwt, () => {
        this.setState({
          isLoading: false,
          jwt: data.jwt
        })
      })
    })
  }
  componentDidMount () {
    this.getInfo()
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
    if (this.state.isLoading) {
      return this.renderLoading()
    }

    if (!this.state.jwt) {
      return this.renderLogin()
    }

    return this.renderMainApp()
  }
}

export default Main