import makeHashReducer, {mergeHashActions} from './hashReducer'

// ==================
// ==================
//      REDUCER
// ==================
// ==================

const defaultState = {}
export default function (state = defaultState, action) {
  switch (action.type) {
  case 'CUSTOM_CHANNEL_ACTION':
    return state
  default:
    return makeHashReducer('Channel')(state, action)
  }
}

// ==================
// ==================
//      ACTIONS
// ==================
// ==================

const customChannelActions = {}
export const channelActions = mergeHashActions(customChannelActions, 'Channel')

// ==================
// ==================
//      THUNKS
// ==================
// ==================

// export const channelThunks = {}
