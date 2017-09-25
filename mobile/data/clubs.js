import makeHashReducer, {mergeHashActions} from './hashReducer'

// ==================
// ==================
//      REDUCER
// ==================
// ==================

const defaultState = {}
export default function (state = defaultState, action) {
  switch (action.type) {
  case 'CUSTOM_CLUB_ACTION':
    return state
  default:
    return makeHashReducer('Club')(state, action)
  }
}

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
      successActionCreator: clubActions.onChannelsReturn
    }
  }
}

export const createChannel = (clubInfo, onSuccess) => {
  return {
    type: 'CREATE_CLUB_CALL',
    call: {
      action: 'POST',
      endpoint: '/clubs',
      successActionCreator: (res) => {
        return (dispatch) => {
          dispatch(clubActions.mergeClub([res.data]))
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