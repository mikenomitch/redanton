function __addUsers() {
  return {
    1: {
      id: 1,
      name: 'Mike Nomitch',
      email: 'mikenomitch@gmail.com'
    }
  }
}

// ==================
// ==================
//      REDUCER
// ==================
// ==================

const defaultState = {}
export default function (state = defaultState, action) {
  switch (action.type) {
  case 'ADD_USERS':
    return __addUsers(state, action.payload)
  default:
    return state
  }
}

// ==================
// ==================
//      ACTIONS
// ==================
// ==================

export const userActions = {
  addUsers: () => {
    return {
     type: 'ADD_USERS'
    }
  }
}
