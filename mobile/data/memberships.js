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
