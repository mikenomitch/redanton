import merge from 'lodash/fp/merge'

function __addAuthInfo(state, authData) {
  return merge(state, {
    jwt: authData.jwt,
    exp: authData.exp,
    currentUser: authData.user,
    initialStateLoaded: true
  })
}

function __initialAuth(state, jwt) {
  return merge(state, {
    jwt: jwt,
    exp: null,
    currentUser: null,
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
    return __addAuthInfo(state, action.payload)
  case 'LOAD_INITIAL_AUTH':
    return __initialAuth(state, action.payload)
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
  addAuth: (userData) => ({
    type: 'ADD_AUTH',
    payload: userData,
    asyncData: userData.jwt,
    asyncKey: 'jwt'
  }),

  loadInitialAuth: (jwt) => ({
    type: 'LOAD_INITIAL_AUTH',
    payload: jwt
  }),

  clearCreds: () => ({
    type: 'CLEAR_CREDS',
    asyncData: null,
    asyncKey: 'jwt'
  })
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
    asyncKey: 'jwt'
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
      onSuccess: authActions.addAuth,
      onError: authActions.onSignInFailure
    }
  }
}