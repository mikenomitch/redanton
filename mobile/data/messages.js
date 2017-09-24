import makeHashReducer, {mergeHashActions} from './hashReducer'

// ==================
// ==================
//      REDUCER
// ==================
// ==================

const defaultState = {}
export default function (state = defaultState, action) {
  switch (action.type) {
  case 'CUSTOM_MESSAGE_ACTION':
    return state
  default:
    return makeHashReducer('Message')(state, action)
  }
}

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