import merge from 'lodash/fp/merge'

import { alertMessage } from '../lib/uiActions'

function __mergeAuthData(state, authData) {
  return merge(state, {
    jwt: authData && authData.jwt,
    exp: authData && authData.exp,
    currentUser: authData && authData.user,
    initialStateLoaded: true
  })
}

function __clearCreds(state) {
  return merge(state, {
    jwt: null,
    exp: null,
    currentUser: null,
    initialStateLoaded: true
  })
}

// ==================
// ==================
//      REDUCER
// ==================
// ==================

const defaultState = {
  exp: null,
  initialStateLoaded: false,
  jwt: null,
  currentUser: null
}

export default function (state = defaultState, action) {
  switch (action.type) {
  case 'ADD_AUTH':
    return __mergeAuthData(state, action.payload)
  case 'LOAD_INITIAL_AUTH':
    return __mergeAuthData(state, action.payload)
  case 'CLEAR_CREDS':
    return __clearCreds(state)
  default:
    return state
  }
}

// ==================
// ==================
//      ACTIONS
// ==================
// ==================

export const authActions = {
  addAuth: (userData) => {
    return {
      type: 'ADD_AUTH',
      payload: userData,
      asyncData: { userData }
    }
  },

  loadInitialAuth: (userData) => {
    return {
      type: 'LOAD_INITIAL_AUTH',
      payload: userData
    }
  },

  clearCreds: () => ({
    type: 'CLEAR_CREDS',
    asyncData: {userData: null}
  }),

  onSignInFailure: () => {
    alertMessage('Sign In Failed', 'there was an issue signing in. try again.')
  }
}

// =================
// =================
//   ASYNC ACTIONS
// =================
// =================

export const loadInitialAuth = () => {
  return {
    type: 'GET_INITIAL_AUTH',
    withAsyncData: authActions.loadInitialAuth,
    asyncKey: 'userData'
  }
}

export const signIn = (userInfo) => {
  return {
    type: 'SIGN_IN',
    call: {
      action: 'POST',
      endpoint: '/api_login/v1',
      params: {
        email: userInfo.email,
        password: userInfo.password
      },
      opts: {
        useNonApi: true
      },
      successActionCreator: authActions.addAuth,
      errorActionCreator: authActions.onSignInFailure
    }
  }
}