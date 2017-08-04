import { AsyncStorage } from 'react-native'
import MainNav from './components/navigation/MainNav'
import { post } from './lib/fetcher'

// immediately request a new jwt
post('/api_login/v1', {}, {useNonApi: true}).then( (data) => {
  AsyncStorage.setItem('jwt', data.jwt)
})

export default MainNav
