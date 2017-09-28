const withResetState = (defaultState, revertType) => (childReducer) => (state, action) => {
  switch (action.type) {
  case revertType:
    return defaultState
  default:
    return childReducer(state, action)
  }
}

export default withResetState