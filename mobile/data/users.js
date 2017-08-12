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

const customUserActions = {}
export const userActions = mergeHashActions(customUserActions, 'User')

// =================
// =================
//   ASYNC ACTIONS
// =================
// =================

// export const userThunks = {}
