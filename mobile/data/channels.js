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

const customChannelActions = {
  onChannelsReturn: (res) => ({
    type: 'MERGE_CHANNELS',
    payload: res.data
  })
}

export const channelActions = mergeHashActions(customChannelActions, 'Channel')

// =================
// =================
//   ASYNC ACTIONS
// =================
// =================

export const getChannels = () => {
  return {
    type: 'GET_CHANNELS',
    call: {
      action: 'GET',
      endpoint: '/channels',
      onSuccess: channelActions.onChannelsReturn
    }
  }
}
