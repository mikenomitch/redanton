import merge from 'lodash/fp/merge'

import withResetState from './withResetState'

// TODO: make this only track so many of the same call
function __setCall(state, payload) {
  const newCallVal = merge(payload, {previousCall: state[payload.key]})
  return merge(state, {[payload.key]: newCallVal})
}

// ==================
// ==================
//      REDUCER
// ==================
// ==================

const defaultState = {}
function callReducer (state = defaultState, action) {
  switch (action.type) {
  case 'SET_CALL':
    return __setCall(state, action.payload)
  default:
    return state
  }
}

export default withResetState(defaultState, 'SIGN_OUT')(callReducer)

// ==================
// ==================
//      ACTIONS
// ==================
// ==================

export const callActions = {
  callStart: (callKey) => ({
    type: 'SET_CALL',
    payload: {
      key: callKey,
      status: 'started'
    }
  }),
  callSuccess: (callKey) => ({
    type: 'SET_CALL',
    payload: {
      key: callKey,
      status: 'success'
    }
  }),
  callError: (callKey) => ({
    type: 'SET_CALL',
    payload: {
      key: callKey,
      status: 'error'
    }
  })
}

export const callStatus = (call) => {
  return call && call.status || 'uncalled'
}

export const callSuccessfull = (call) => {
  return callStatus(call) === 'success'
}

export const everHadSuccess = (call) => {
  return call && (callSuccessfull(call) || everHadSuccess(call.previousCall))
}

export const callsDone = (state, callKeys) => {
  return callKeys.every((callKey) => (
    everHadSuccess(state.calls[callKey], callKey)
  ))
}