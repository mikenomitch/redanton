import {
  deleteCall,
  get,
  patch,
  post
} from '../../lib/fetcher'

import { authActions } from '../../data/auth'

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
    const successAction = callOptions.successActionCreator && callOptions.successActionCreator(data)
    return successAction && store.dispatch(successAction)
  }

  const onFetchError = (error) => {
    // TODO: does this know too much about the app now?
    if (error.message === 'bad auth') {
      store.dispatch(authActions.signOut())
    }

    const errorAction = callOptions.errorActionCreator && callOptions.errorActionCreator(error)
    errorAction && store.dispatch(errorAction)
  }

  __fetchPromise(callOptions).then(onFetchSuccess, onFetchError)

  return next(action)
}

export default withFetching
