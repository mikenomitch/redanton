import makeHashReducer, {mergeHashActions} from './hashReducer'
import withResetState from './withResetState'

// ==================
// ==================
//      REDUCER
// ==================
// ==================

const defaultState = {}
function channelReducer (state = defaultState, action) {
  switch (action.type) {
  case 'CUSTOM_CHANNEL_ACTION':
    return state
  default:
    return makeHashReducer('Channel')(state, action)
  }
}

export default withResetState(defaultState, 'SIGN_OUT')(channelReducer)

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
      successActionCreator: channelActions.onChannelsReturn
    }
  }
}

export const createChannel = (clubId, channelInfo, onSuccess) => {
  return {
    type: 'CREATE_CHANNEL_CALL',
    call: {
      action: 'POST',
      endpoint: `/clubs/${clubId}/channels`,
      successActionCreator: (res) => {
        return (dispatch) => {
          dispatch(channelActions.mergeChannels([res.data]))
          onSuccess(res)
        }
      },
      errorActionCreator: () => { alert('there was an issue - you are likely missing an important field') },
      params: {
        channel: {
          name: channelInfo.name,
          description: channelInfo.description
        }
      }
    }
  }
}

export const updateChannel = (channelInfo, onSuccess) => {
  return {
    type: 'UPDATE_CHANNEL_CALL',
    call: {
      action: 'PATCH',
      endpoint: `/channels/${channelInfo.id}`,
      successActionCreator: (res) => {
        return (dispatch) => {
          dispatch(channelActions.mergeChannels([res.data]))
          onSuccess(res)
        }
      },
      errorActionCreator: () => { alert('there was an issue - you are likely missing an important field') },
      params: {
        channel: {
          name: channelInfo.name,
          description: channelInfo.description
        }
      }
    }
  }
}

export const deleteChannel = (channelId, onSuccess) => {
  return {
    type: 'DELETE_CHANNEL_CALL',
    call: {
      action: 'DELETE',
      endpoint: `/channels/${channelId}`,
      successActionCreator: () => {
        return (dispatch) => {
          onSuccess && onSuccess()
          dispatch(channelActions.removeChannel(channelId))
        }
      }
    }
  }
}
