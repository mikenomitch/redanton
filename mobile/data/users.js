import { Permissions, Notifications } from 'expo'
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
      callKey: 'mainUsers',
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
      errorActionCreator: () => {
        alert('Could not update. Re-enter changes an try again.')
      },
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

export function registerPushNotifications() {
  return (dispatch) => {
    Permissions.getAsync(Permissions.REMOTE_NOTIFICATIONS).then(({existingStatus}) => {
      let finalStatus = existingStatus
      // only ask if permissions have not already been determined, because
      // iOS won't necessarily prompt the user a second time.
      if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS

        Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS).then(({status}) => {
          finalStatus = status

          // Stop here if the user did not grant permissions
          if (finalStatus !== 'granted') {
            dispatch({type: 'DO_NOTHING'})
          }

          // Get the token that uniquely identifies this device
          Notifications.getExponentPushTokenAsync().then((token) => {
            dispatch({
              type: 'REGISTER_PUSH_NOTIFICATION',
              call: {
                action: 'POST',
                endpoint: '/users/create_token',
                params: {
                  token: token
                },
                successActionCreator: () => {}
              }
            })
          })
        })
      }
    })
  }
}
