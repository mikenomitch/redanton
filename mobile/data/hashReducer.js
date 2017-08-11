function __addRecords () {}
function __updateRecord () {}
function __removeRecord () {}

const makeHashReducer = (baseName) => {
  const upcasedBase = baseName.toUpperCase()

  return function (state, action) {
    switch (action.type) {
    case [`MERGE_${upcasedBase}S`]:
      return __addRecords(state, action.payload)
    case [`UPDATE_${upcasedBase}`]:
      return __updateRecord(state, action.payload)
    case [`REMOVE_${upcasedBase}`]:
      return __removeRecord(state, action.payload)
    default:
      return state
    }
  }
}

export const makeHashActions = (baseName) => {
  const upcasedBase = baseName.toUpperCase()
  return {
    [`merge${baseName}s`]: (recordsList) => ({
      type: `MERGE_${upcasedBase}S`,
      payload: recordsList
    }),
    [`update${baseName}`]: (record) => ({
      type: `MERGE_${upcasedBase}S`,
      payload: record
    }),
    [`remove${baseName}`]: (id) => ({
      type: `REMOVE_${upcasedBase}S`,
      payload: id
    }),
  }
}

export default makeHashReducer
