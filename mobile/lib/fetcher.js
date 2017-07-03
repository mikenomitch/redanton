const base = 'https://stormy-reef-53700.herokuapp.com/api/v1'

export function get(endpoint) {
	return fetch(base + endpoint).then((response) => response.json())
}
