import pick from 'lodash/fp/pick'

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
  default:
    return makeHashReducer('PostsTag')(state, action)
  }
}

export default withResetState(defaultState, 'SIGN_OUT')(postsTagsReducer)

// ==================
// ==================
//      ACTIONS
// ==================
// ==================

const customPostsTagsActions = {}
export const postsTags = mergeHashActions(customPostsTagsActions, 'PostsTag')

// =================
//   ASYNC ACTIONS
// =================


// =================
//   HELPERS
// =================

export const postsForTag = (state, tag) => {
  const postIdsForTag = Object.values(state.postsTags)
    .filter((pt) => pt.tag_id === tag.id)
    .map((pt) => pt.post_id)

  return pick(postIdsForTag, state.posts)
}

export const tagsForPost = (state, post) => {
  const tagIdsForPost = Object.values(state.postsTags)
    .filter((pt) => pt.post_id === post.id)
    .map((pt) => pt.tag_id)

  return pick(tagIdsForPost, state.tags)
}
