import makeHashReducer, {mergeHashActions} from './hashReducer'

// ==================
// ==================
//      REDUCER
// ==================
// ==================

const defaultState = {}
export default function (state = defaultState, action) {
  switch (action.type) {
  case 'CUSTOM_POST_ACTION':
    return state
  default:
    return makeHashReducer('Post')(state, action)
  }
}

// ==================
// ==================
//      ACTIONS
// ==================
// ==================

const customPostActions = {}
export const postActions = mergeHashActions(customPostActions, 'Post')

// ==================
// ==================
//      THUNKS
// ==================
// ==================

// export const postThunks = {}
