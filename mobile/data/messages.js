import makeHashReducer, {mergeHashActions} from './hashReducer'
import withResetState from './withResetState'

// ==================
// ==================
//      REDUCER
// ==================
// ==================

const defaultState = {}
function messageReducer (state = defaultState, action) {
  switch (action.type) {
  case 'CUSTOM_MESSAGE_ACTION':
    return state
  default:
    return makeHashReducer('Message')(state, action)
  }
}

export default withResetState(defaultState, 'SIGN_OUT')(messageReducer)

// ==================
// ==================
//      ACTIONS
// ==================
// ==================

const customMessageActions = {
  onMessagesReturn: (res) => {
    return messageActions.mergeMessages(res.data)
  }
}
export const messageActions = mergeHashActions(customMessageActions, 'Message')

// =================
// =================
//   ASYNC ACTIONS
// =================
// =================

export const getMessagesForPost = (postId) => {
  return {
    type: 'GET_MESSAGES_FOR_POST',
    call: {
      action: 'GET',
      endpoint: `/posts/${postId}/messages`,
      successActionCreator: messageActions.onMessagesReturn
    }
  }
}