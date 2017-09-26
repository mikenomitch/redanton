import makeHashReducer, {mergeHashActions} from './hashReducer'

// ==================
// ==================
//      REDUCER
// ==================
// ==================

const defaultState = {}
export default function (state = defaultState, action) {
  switch (action.type) {
  default:
    return makeHashReducer('Membership')(state, action)
  }
}

// ==================
// ==================
//      ACTIONS
// ==================
// ==================

const customMembershipActions = {
  onMembershipsReturn: (res) => ({
    type: 'MERGE_MEMBERSHIPS',
    payload: res.data
  })
}

export const membershipActions = mergeHashActions(customMembershipActions, 'Membership')

// =================
// =================
//   ASYNC ACTIONS
// =================
// =================

export const getMemberships = (clubId) => {
  return {
    type: 'GET_MEMBERSHIPS',
    call: {
      action: 'GET',
      endpoint: `/clubs/${clubId}/memberships`,
      successActionCreator: membershipActions.onMembershipsReturn
    }
  }
}

export const kickMember = (membershipId, onSuccess) => {
  return {
    type: 'KICK_MEMBER_CALL',
    call: {
      action: 'DELETE',
      endpoint: `/memberships/${membershipId}`,
      successActionCreator: () => {
        return (dispatch) => {
          onSuccess && onSuccess()
          dispatch(membershipActions.removeMembership(membershipId))
        }
      }
    }
  }
}

export const elevateMembership = (membershipId, onSuccess) => {
  return {
    type: 'ELEVATE_MEMBERSHIP_CALL',
    call: {
      action: 'PATCH',
      endpoint: `/memberships/${membershipId}`,
      params: {
        membership: {
          type: 'admin'
        }
      },
      errorActionCreator: () => { alert('error elevating memership to admin. try again.') },
      successActionCreator: (res) => {
        return (dispatch) => {
          dispatch(membershipActions.mergeMemberships([res.data]))
          onSuccess && onSuccess(res)
        }
      }
    }
  }
}