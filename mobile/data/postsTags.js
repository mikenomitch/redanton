import omitBy from 'lodash/fp/omitBy'
import pick from 'lodash/fp/pick'

import makeHashReducer, {mergeHashActions} from './hashReducer'
import withResetState from './withResetState'

// ==================
// ==================
//      REDUCER
// ==================
// ==================

function postsTagsWithoutPost(state, post) {
  const belongsToPost = (pt) => {
    return pt.post_id === post.id
  }

  return omitBy(belongsToPost, state)
}

const defaultState = {}
function postsTagsReducer (state = defaultState, action) {
  switch (action.type) {
  case 'REMOVE_POSTSTAGS_FOR_POSTS':
    return postsTagsWithoutPost(state, action.payload)
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

// none

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

export const postWithTagNames = (state, post) => {
  const tags = Object.values(tagsForPost(state, post))
  const tagNames = tags.map(t => t.name).join(',')
  return Object.assign({}, post, {tagNames})
}