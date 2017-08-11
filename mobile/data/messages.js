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

const customMessageActions = {}
export const messageActions = mergeHashActions(customMessageActions, 'Message')

// ==================
// ==================
//      THUNKS
// ==================
// ==================

// export const messageThunks = {}
