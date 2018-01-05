import {
  applyMiddleware,
  createStore,
  combineReducers
} from 'redux'

// ===============
//    MIDDLEWARE
// ===============

import thunk from 'redux-thunk'
import multi from 'redux-multi'
// import { createLogger } from 'redux-logger'
import withAsyncStorage from './middleware/withAsyncStorage'
import withFetching from './middleware/withFetching'

// const logger = createLogger({collapsed: true, diff: true})

// ===============
//    REDUCERS
// ===============

import auth from '../data/auth'
import calls from '../data/calls'
import channels from '../data/channels'
import clubs from '../data/clubs'
import memberships from '../data/memberships'
import messages from '../data/messages'
import posts from '../data/posts'
import postsTags from '../data/postsTags'
import tags from '../data/tags'
import users from '../data/users'

const rootReducer = combineReducers({
  auth,
  calls,
  channels,
  clubs,
  memberships,
  messages,
  posts,
  postsTags,
  tags,
  users
})

// ============
//    CONFIG
// ============

const configureStore = () => {
  return createStore(
    rootReducer,
    applyMiddleware(
      multi,
      thunk,
      withAsyncStorage,
      withFetching
      // logger
    )
  )
}

export default configureStore
