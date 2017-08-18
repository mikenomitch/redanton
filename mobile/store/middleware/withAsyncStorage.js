import {
  AsyncStorage
} from 'react-native'

const withAsyncStorage = store => next => action => {
  // SETTING
  const hasAsyncData = action.asyncData

  if (hasAsyncData) {
    Object.keys(action.asyncData).forEach((k) => {
      const v = action.asyncData[k]
      AsyncStorage.setItem(k, JSON.stringify(v))
    })
  }

  // GETTING

  const hasAsyncKey = action.asyncKey
  const hasAsyncFunction = typeof action.withAsyncData === 'function'

  if (hasAsyncKey && hasAsyncFunction) {
    const getVal = new Promise((resolve) => {
      AsyncStorage.getItem(action.asyncKey, (err, data) => (resolve(data)))
    })

    return getVal.then((data) => {
      return store.dispatch(action.withAsyncData(data))
    })
  }

  return next(action)
}

export default withAsyncStorage
