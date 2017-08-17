import {
  AsyncStorage
} from 'react-native'

function noop () {}

const withAsyncStorage = store => next => action => {
  const hasAsyncKey = 'asyncKey' in action
  const hasAsyncFunction = typeof action.withAsyncData === 'function'
  const hasAsyncData = 'asyncData' in action

  // data being stored
  if (hasAsyncKey && hasAsyncData) {
    const onAsyncStorage = action.onAsyncStorage || noop
    AsyncStorage.setItem(action.asyncKey, action.asyncData, onAsyncStorage)
  }

  // data being retrieved
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
