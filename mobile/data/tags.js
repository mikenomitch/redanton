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
  onTagsReturn: (res) => ({
    type: 'MERGE_TAGS',
    payload: res.data
  })
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
