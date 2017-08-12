import {
  deleteCall,
  get,
  patch,
  post
} from '../../lib/fetcher'

import { authActions } from '../../data/auth'

function noop () {}

function __fetchPromise(callOptions) {
  switch (callOptions.action){
  case 'GET':
    return get(callOptions.endpoint, callOptions.opts)
  case 'POST':
    return post(callOptions.endpoint, callOptions.params, callOptions.opts)
  case 'PATCH':
    return patch(callOptions.endpoint, callOptions.params, callOptions.opts)
  case 'DELETE':
    return deleteCall(callOptions.endpoint, callOptions.opts)
  }
}

const withFetching = store => next => action => {
  const callOptions = action.call
  if (typeof callOptions !== 'object') {
    return next(action)
  }

  if (!callOptions.skipAuth) {
    const token = store.getState().auth.jwt
    // TODO: remove the mutation
    callOptions.opts = Object.assign({},
      callOptions.opts || {},
      {token}
    )
  }

  const onFetchSuccess = (data) => {
    // do some fetch tracking here
    const onSuccess = callOptions.onSuccess || noop
    const successAction = onSuccess(data)
    return successAction && store.dispatch(successAction)
  }

  const onFetchError = (error) => {
    // TODO: does this know too much about the app now?
    if (error.message === 'bad auth') {
      return store.dispatch(authActions.clearCreds())
    }

    // do some fetch tracking heres
    // do the jwt invalidation if it is an unauthorized error
    const onError = callOptions.onError || noop
    const errorAction = onError(error)
    errorAction && store.dispatch(errorAction)
  }

  __fetchPromise(callOptions)
    .catch(onFetchError)
    .then(onFetchSuccess)

  return next(action)
}

export default withFetching
