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

export const getChannels = (onSuccess) => {
  return {
    type: 'GET_CHANNELS',
    call: {
      action: 'GET',
      endpoint: '/channels',
      callKey: 'channels',
      successActionCreator: (res) => {
        return (dispatch) => {
          dispatch(channelActions.onChannelsReturn(res))
          onSuccess && onSuccess(res)
        }
      }
    }
  }
}

export const createChannel = (clubId, channelInfo, onSuccess) => {
  return {
    type: 'CREATE_CHANNEL_CALL',
    call: {
      action: 'POST',
      endpoint: `/clubs/${clubId}/channels`,
      params: {
        channel: {
          name: channelInfo.name,
          description: channelInfo.description
        }
      },
      successActionCreator: (res) => {
        return (dispatch) => {
          dispatch(channelActions.mergeChannels([res.data]))
          onSuccess(res)
        }
      },
      errorActionCreator: () => {
        alert('Could not create channel. Please try again.')
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
      params: {
        channel: {
          name: channelInfo.name,
          description: channelInfo.description
        }
      },
      successActionCreator: (res) => {
        return (dispatch) => {
          dispatch(channelActions.mergeChannels([res.data]))
          onSuccess(res)
        }
      },
      errorActionCreator: () => {
        alert('Could not update channel. Please try again.')
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
      },
      errorActionCreator: () => {
        alert('Could not delete channel. Please try again.')
      }
    }
  }
}
