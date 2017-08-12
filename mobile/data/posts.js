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

const customPostActions = {
  onPostsReturn: (res) => ({
    type: 'MERGE_POSTS',
    payload: res.data
  })
}
export const postActions = mergeHashActions(customPostActions, 'Post')

// =================
// =================
//   ASYNC ACTIONS
// =================
// =================

export const getFrontPage = () => {
  return {
    type: 'GET_FRONT_PAGE',
    call: {
      action: 'GET',
      endpoint: '/front',
      onSuccess: postActions.onPostsReturn
    }
  }
}
