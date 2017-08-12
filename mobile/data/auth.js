import { post } from '../lib/fetcher'

function __addAuthInfo(userData) {
  return {
    jwt: userData.jwt,
    exp: userData.exp,
    userId: userData.user.id,
    initialStateLoaded: true
  }
}

function __initialAuth(state, jwt) {
  return {
    jwt: jwt,
    exp: 'later',
    userId: 1,
    initialStateLoaded: true
  }
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
  userId: null
}

export default function (state = defaultState, action) {
  switch (action.type) {
  case 'ADD_AUTH':
    return __addAuthInfo(state, action.payload)
  case 'LOAD_INITIAL_AUTH':
    return __initialAuth(state, action.payload)
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
  })
}

// =================
// =================
//   ASYNC ACTIONS
// =================
// =================

export const authThunks = {
  loadInitialAuth: () => {
    return {
      type: 'GET_INITIAL_AUTH',
      withAsyncData: authActions.loadInitialAuth,
      asyncKey: 'jwt'
    }
  },

  signIn: (userInfo) => {
    return (dispatch) => {
      post(
        '/api_login/v1',
        {
          email: userInfo.email,
          password: userInfo.password
        },
        {useNonApi: true}
      ).then( userData => dispatch(authActions.addAuth(userData)))
    }
  }
}