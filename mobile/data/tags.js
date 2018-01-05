import flatten from 'lodash/flatten'
import omit from 'lodash/fp/omit'

import makeHashReducer, {mergeHashActions} from './hashReducer'
import withResetState from './withResetState'

// ==================
// ==================
//      REDUCER
// ==================
// ==================

const defaultState = {}
function tagReducer (state = defaultState, action) {
  switch (action.type) {
  case 'CUSTOM_TAG_ACTION':
    return state
  default:
    return makeHashReducer('Tag')(state, action)
  }
}

export default withResetState(defaultState, 'SIGN_OUT')(tagReducer)

// ==================
// ==================
//      ACTIONS
// ==================
// ==================

const customTagActions = {
  onTagsReturn: (res) => {
    const tagsSansPostsTags = res.data.map(t => omit(['posts_tags'], t))
    const postsTags = flatten(res.data.map((t) => t.posts_tags))
    // TODO: set up normalizr

    return [
      {
        type: 'MERGE_TAGS',
        payload: tagsSansPostsTags
      },
      {
        type: 'MERGE_POSTSTAGS',
        payload: postsTags
      }
    ]
  }
}

export const tagActions = mergeHashActions(customTagActions, 'Tag')

// =================
// =================
//   ASYNC ACTIONS
// =================
// =================

export const getTags = (onSuccess) => {
  return {
    type: 'GET_TAGS',
    call: {
      action: 'GET',
      endpoint: '/tags',
      callKey: 'tags',
      successActionCreator: (res) => {
        return (dispatch) => {
          dispatch(tagActions.onTagsReturn(res))
          onSuccess && onSuccess(res)
        }
      }
    }
  }
}
