import makeHashReducer, {mergeHashActions} from './hashReducer'
import withResetState from './withResetState'

// ==================
// ==================
//      REDUCER
// ==================
// ==================

const defaultState = {}
function postsTagsReducer (state = defaultState, action) {
  switch (action.type) {
  case 'CUSTOM_POSTS_TAGS_ACTION':
    return state
  default:
    return makeHashReducer('PostsTags')(state, action)
  }
}

export default withResetState(defaultState, 'SIGN_OUT')(postsTagsReducer)

// ==================
// ==================
//      ACTIONS
// ==================
// ==================

const customPostsTagsActions = {}
export const postsTags = mergeHashActions(customPostsTagsActions, 'PostsTags')

// =================
//   ASYNC ACTIONS
// =================
