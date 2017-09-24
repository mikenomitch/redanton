import {
  applyMiddleware,
  createStore,
  combineReducers
} from 'redux'

// ===============
//    MIDDLEWARE
// ===============

import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import withAsyncStorage from './middleware/withAsyncStorage'
import withFetching from './middleware/withFetching'

const logger = createLogger({collapsed: true, diff: true})

// ===============
//    REDUCERS
// ===============

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

// ============
//    CONFIG
// ============

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
