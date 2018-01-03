import map from 'lodash/map'
import flatten from 'lodash/flatten'
import merge from 'lodash/fp/merge'
import indexBy from 'lodash/fp/indexBy'
import pick from 'lodash/fp/pick'

import makeHashReducer, {mergeHashActions} from './hashReducer'
import withResetState from './withResetState'

function withPostsTags(state, tagsList) {
  const allPostsTags = flatten(map(tagsList, (t) => t.posts_tags))
  const keyed = indexBy('id', allPostsTags)
  return merge(state, keyed)
}

// ==================
// ==================
//      REDUCER
// ==================
// ==================

const defaultState = {}
function postsTagsReducer (state = defaultState, action) {
  switch (action.type) {
  case 'MERGE_TAGS':
    return withPostsTags(state, action.payload)
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
