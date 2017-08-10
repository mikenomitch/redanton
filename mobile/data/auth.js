function __addAuthInfo() {
  // TODO: implement action
  return {
    jwt: '12345',
    exp: 'later',
    userId: 1
  }
}

// ==================
// ==================
//      REDUCER
// ==================
// ==================

const defaultState = {
  jwt: null,
  exp: null,
  userId: null
}

export default function (state = defaultState, action) {
  switch (action.type) {
  case 'ADD_AUTH':
    return __addAuthInfo(state, action.payload)
  default:
    return state
  }
}

// ==================
// ==================
//      ACTIONS
// ==================
// ==================

export const authActions = {
  addAuth: () => ({
    type: 'ADD_AUTH'
  })
}
