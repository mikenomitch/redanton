import makeHashReducer, {mergeHashActions} from './hashReducer'
import { authActions } from './auth'

// ==================
// ==================
//      REDUCER
// ==================
// ==================

const defaultState = {}
export default function (state = defaultState, action) {
  switch (action.type) {
  case 'CUSTOM_USER_ACTION':
    return state
  default:
    return makeHashReducer('User')(state, action)
  }
}

// ==================
// ==================
//      ACTIONS
// ==================
// ==================

const customUserActions = {
  onUsersReturn: (res) => {
    return userActions.mergeUsers(res.users)
  },
  onUserSignUp: () => {
    alert('USER SIGN UP SUCCESS')
  }
}
export const userActions = mergeHashActions(customUserActions, 'User')

// =================
// =================
//   ASYNC ACTIONS
// =================
// =================

export const getUsersForPost = (postId) => {
  return {
    type: 'GET_USERS_FOR_POST',
    call: {
      action: 'GET',
      endpoint: `/posts/${postId}/users`,
      successActionCreator: userActions.onUsersReturn
    }
  }
}

export const getUsersForMain = () => {
  return {
    type: 'GET_USERS_FOR_MAIN',
    call: {
      action: 'GET',
      endpoint: '/users',
      successActionCreator: userActions.onUsersReturn
    }
  }
}

export const updateSelf = (params, onSuccess) => {
  return {
    type: 'UPDATE_SELF',
    call: {
      action: 'PATCH',
      endpoint: '/users/self',
      successActionCreator: (res) => {
        return (dispatch) => {
          dispatch(userActions.mergeUsers([res.data]))
          dispatch(authActions.updateCurrentUser(res.data))
          onSuccess && onSuccess(res)
        }
      },
      errorActionCreator: () => { alert('there was an issue - you are likely missing an important field') },
      params: {
        user: params
      },
    }
  }
}

export const signUp = () => {
  return {
    type: 'SIGN_UP_USER',
    call: {
      action: 'POST',
      endpoint: '/users',
      successActionCreator: userActions.onUserSignUp
    }
  }
}
