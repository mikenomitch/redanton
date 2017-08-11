import {
  applyMiddleware,
  createStore,
  combineReducers
} from 'redux'

import thunk from 'redux-thunk'
import withAsyncStorage from './middleware/withAsyncStorage'

import auth from '../data/auth'
import users from '../data/users'

const rootReducer = combineReducers({
  auth,
  users
})

const configureStore = () => {
  const store = createStore(
    rootReducer,
    applyMiddleware(thunk, withAsyncStorage)
  )

  return store
}

export default configureStore
