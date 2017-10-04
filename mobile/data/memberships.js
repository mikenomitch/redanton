import makeHashReducer, {mergeHashActions} from './hashReducer'
import withResetState from './withResetState'

// ==================
// ==================
//      REDUCER
// ==================
// ==================

const defaultState = {}
function membershipReducer (state = defaultState, action) {
  switch (action.type) {
  default:
    return makeHashReducer('Membership')(state, action)
  }
}

export default withResetState(defaultState, 'SIGN_OUT')(membershipReducer)

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
      },
      errorActionCreator: () => {
        alert('Could not kick user from group. Please try again.')
      }
    }
  }
}

export const createMembership = (clubId, email, onSuccess) => {
  return {
    type: 'CREATE_MEMBERSHIP',
    call: {
      action: 'POST',
      params: { email, type: 'standard' },
      endpoint: `/clubs/${clubId}/memberships`,
      successActionCreator: (res) => {
        return (dispatch) => {
          onSuccess && onSuccess()
          dispatch(membershipActions.mergeMemberships([res.data]))
        }
      },
      errorActionCreator: () => {
        alert('Could not add user to group. Please try again.')
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
      successActionCreator: (res) => {
        return (dispatch) => {
          dispatch(membershipActions.mergeMemberships([res.data]))
          onSuccess && onSuccess(res)
        }
      },
      errorActionCreator: () => {
        alert('Could not make user admin. Please try again.')
      }
    }
  }
}