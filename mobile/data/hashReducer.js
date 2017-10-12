import merge from 'lodash/fp/merge'
import omit from 'lodash/fp/omit'
import indexBy from 'lodash/fp/indexBy'

function __mergeRecords (state, recordList) {
  const keyed = indexBy('id', recordList)
  return merge(state, keyed)
}

function __updateRecord (state, record) {
  const listOfOne = [record]
  return __mergeRecords(state, listOfOne)
}

function __removeRecord (state, id) {
  return omit(id)(state)
}

const makeHashReducer = (baseName) => {
  const upcasedBase = baseName.toUpperCase()

  return function (state, action) {
    switch (action.type) {
    case `MERGE_${upcasedBase}S`:
      return __mergeRecords(state, action.payload)
    case `UPDATE_${upcasedBase}`:
      return __updateRecord(state, action.payload)
    case `REMOVE_${upcasedBase}`:
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
      type: `UPDATE_${upcasedBase}`,
      payload: record
    }),
    [`remove${baseName}`]: (id) => ({
      type: `REMOVE_${upcasedBase}`,
      payload: id
    }),
  }
}

export const mergeHashActions = (customActions, baseName) => {
  const hashActions = makeHashActions(baseName)
  return Object.assign({}, hashActions, customActions)
}

export default makeHashReducer
