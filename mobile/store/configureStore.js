import {
  applyMiddleware,
  createStore,
  combineReducers
} from 'redux'

import logger from 'redux-logger'
import thunk from 'redux-thunk'
import withAsyncStorage from './middleware/withAsyncStorage'
import withFetching from './middleware/withFetching'

import auth from '../data/auth'
import channels from '../data/channels'
import clubs from '../data/clubs'
import messages from '../data/messages'
import posts from '../data/posts'
import users from '../data/users'

const rootReducer = combineReducers({
  auth,
  channels,
  clubs,
  messages,
  posts,
  users
})

const configureStore = () => {
  const store = createStore(
    rootReducer,
    applyMiddleware(
      thunk,
      withAsyncStorage,
      withFetching,
      logger
    )
  )

  return store
}

export default configureStore
