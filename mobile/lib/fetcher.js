import {
  AsyncStorage
} from 'react-native'

// const nonApiBase = 'https://stormy-reef-53700.herokuapp.com'
const nonApiBase = 'https://b45591f3.ngrok.io'
const base = `${nonApiBase}/api/v1`

function __asyncGetToken() {
  return new Promise((resolve) => {
    AsyncStorage.getItem('jwt', (err, token) => {
      resolve(token)
    })
  })
}

function __jsonify(res) {
  return res.json()
}

function __identity(input) {
  return input
}

function __makeUrl(endpoint, opts) {
  let baseToUse = base
  if (opts.useNonApi) {
    baseToUse = nonApiBase
  }

  return baseToUse + endpoint
}

function __getHeadersAsync(method, opts) {
  return __asyncGetToken().then((token) => {
    if (opts.headers) return opts.headers
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }

    if (method === 'DELETE' || method === 'GET') {
      headers = {
        'Authorization': `Bearer ${token}`
      }
    }

    return headers
  })
}

function __makeBody(method, params) {
  return method === 'DELETE' || method === 'GET' ?
    null :
    JSON.stringify(params)
}

function __getDefaultCb(method, opts) {
  if (opts.callback) return opts.callback

  return method === 'DELETE' ?
    __identity :
    __jsonify
}

function __baseCall(endpoint, params, opts, method) {
  const url = __makeUrl(endpoint, opts)
  const postCall = __getDefaultCb(method, opts)
  const body = __makeBody(method, params)

  return __getHeadersAsync(method, opts).then((headers) => {
    return fetch(url, {
      method: method,
      headers: headers,
      body
    }).then(postCall)
  })
}


export function get(endpoint, opts = {}) {
  return __baseCall(endpoint, {}, opts, 'GET')
}

export function post(endpoint, params = {}, opts = {}) {
  return __baseCall(endpoint, params, opts, 'POST')
}

export function patch(endpoint, params = {}, opts = {}) {
  return __baseCall(endpoint, params, opts, 'PATCH')
}

export function deleteCall(endpoint, params = {}, opts = {}) {
  return __baseCall(endpoint, params, opts, 'DELETE')
}