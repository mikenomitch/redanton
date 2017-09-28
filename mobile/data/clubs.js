import makeHashReducer, {mergeHashActions} from './hashReducer'
import withResetState from './withResetState'

// ==================
// ==================
//      REDUCER
// ==================
// ==================

const defaultState = {}
function clubReducer (state = defaultState, action) {
  switch (action.type) {
  case 'CUSTOM_CLUB_ACTION':
    return state
  default:
    return makeHashReducer('Club')(state, action)
  }
}

export default withResetState(defaultState, 'SIGN_OUT')(clubReducer)

// ==================
// ==================
//      ACTIONS
// ==================
// ==================

const customClubActions = {
  onClubsReturn: (res) => ({
    type: 'MERGE_CLUBS',
    payload: res.data
  })
}
export const clubActions = mergeHashActions(customClubActions, 'Club')

// =================
// =================
//   ASYNC ACTIONS
// =================
// =================

export const getClubs = () => {
  return {
    type: 'GET_CLUBS',
    call: {
      action: 'GET',
      endpoint: '/clubs',
      successActionCreator: clubActions.onClubsReturn
    }
  }
}

export const createClub = (clubInfo, onSuccess) => {
  return {
    type: 'CREATE_CLUB_CALL',
    call: {
      action: 'POST',
      endpoint: '/clubs',
      successActionCreator: (res) => {
        return (dispatch) => {
          dispatch(clubActions.mergeClubs([res.data]))
          onSuccess(res)
        }
      },
      errorActionCreator: () => { alert('there was an issue - you are likely missing an important field') },
      params: {
        club: {
          name: clubInfo.name,
          description: clubInfo.description
        }
      }
    }
  }
}

export const updateClub = (clubInfo, onSuccess) => {
  return {
    type: 'UPDATE_CLUB_CALL',
    call: {
      action: 'PATCH',
      endpoint: `/clubs/${clubInfo.id}`,
      successActionCreator: (res) => {
        return (dispatch) => {
          dispatch(clubActions.mergeClubs([res.data]))
          onSuccess(res)
        }
      },
      errorActionCreator: () => { alert('there was an issue - you are likely missing an important field') },
      params: {
        club: {
          name: clubInfo.name,
          description: clubInfo.description
        }
      }
    }
  }
}

export const leaveClub = (clubId, onSuccess) => {
  return {
    type: 'LEAVE_CLUB_CALL',
    call: {
      action: 'DELETE',
      endpoint: `/clubs/${clubId}/leave`,
      successActionCreator: () => {
        return (dispatch) => {
          onSuccess && onSuccess()
          dispatch(clubActions.removeClub(clubId))
        }
      }
    }
  }
}
