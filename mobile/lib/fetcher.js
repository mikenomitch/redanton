const base = 'https://stormy-reef-53700.herokuapp.com/api/v1'

function jsonify(res) {
  return res.json()
}

export function get(endpoint) {
  return fetch(base + endpoint).then(jsonify)
}

export function post(endpoint, params = {}) {
  return fetch(base + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  }).then(jsonify)
}
