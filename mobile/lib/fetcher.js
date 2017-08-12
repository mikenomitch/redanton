// const nonApiBase = 'https://stormy-reef-53700.herokuapp.com'
const nonApiBase = 'https://d6e210e2.ngrok.io'
const base = `${nonApiBase}/api/v1`

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

function __makeHeaders(method, opts) {
  if (opts.headers) return opts.headers
  let headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${opts.token}`
  }

  if (method === 'DELETE' || method === 'GET') {
    headers = {
      'Authorization': `Bearer ${opts.token}`
    }
  }

  return headers
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
  const body = __makeBody(method, params)
  const headers = __makeHeaders(method, opts)
  const onReturn = __getDefaultCb(method, opts)

  return fetch(url, {
    method: method,
    headers: headers,
    body
  }).then(onReturn)
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

export function deleteCall(endpoint, opts = {}) {
  return __baseCall(endpoint, opts, 'DELETE')
}
