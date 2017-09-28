import makeHashReducer, {mergeHashActions} from './hashReducer'
import withResetState from './withResetState'
import { authActions } from './auth'

// ==================
// ==================
//      REDUCER
// ==================
// ==================

const defaultState = {}
function userReducer (state = defaultState, action) {
  switch (action.type) {
  case 'CUSTOM_USER_ACTION':
    return state
  default:
    return makeHashReducer('User')(state, action)
  }
}

export default withResetState(defaultState, 'SIGN_OUT')(userReducer)


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
          dispatch(userActions.mergeUsers([res]))
          dispatch(authActions.updateCurrentUser(res))
          onSuccess && onSuccess(res)
        }
      },
      errorActionCreator: () => { alert('there was an issue - you are likely missing an important field') },
      params: {
        user: {
          avatar: params.avatar,
          email: params.email,
          name: params.name,
          password: params.password,
          password_confirmation: params.passwordConfirmation
        }
      }
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
