import {
  applyMiddleware,
  createStore,
  combineReducers
} from 'redux'

import thunk from 'redux-thunk'

import auth from './auth'
import users from './users'

const rootReducer = combineReducers({
  auth,
  users
})

const configureStore = () => {
  const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
  )

  return store
}

export default configureStore
