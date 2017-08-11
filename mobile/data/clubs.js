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

const customClubActions = {}
export const clubActions = mergeHashActions(customClubActions, 'Club')

// ==================
// ==================
//      THUNKS
// ==================
// ==================

// export const clubThunks = {}
