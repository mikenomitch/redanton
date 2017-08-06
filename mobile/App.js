import React from 'react'
import { AsyncStorage } from 'react-native'
import { get, post } from './lib/fetcher'

import Main from './components/Main'

// immediately request a new jwt
post('/api_login/v1', {}, {useNonApi: true}).then((data) => {
  AsyncStorage.setItem('jwt', data.jwt)
})

export default Main
