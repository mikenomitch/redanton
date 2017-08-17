import makeHashReducer, {mergeHashActions} from './hashReducer'

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
