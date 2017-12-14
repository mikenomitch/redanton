import find from 'lodash/fp/find'

// === VALUE CHECKS===

const hasPresence = (value) => {
  return !!value
}

const isOfLength = (minLength, value) => {
  return value && value.length >= minLength
}

// OR EQUAL TO
const isLessThanOrEqualTo = (minLength, value) => {
  return value && value.length <= minLength
}

const isValidEmail = (value) => {
  const emailRegex = /\S+@\S+\.\S+/
  return emailRegex.test(value)
}

// const isValidUrl = (value) => {
//   return !!value
// }

// === VALIDATION CREATORS===

export const validatePresence = (errorMessage) => (value) => {
  return hasPresence(value) ? null : errorMessage
}

export const validateEmail = (errorMessage) => (value) => {
  return isValidEmail(value) ? null : errorMessage
}

export const validateLength = ({min: min, max: max, msg: msg}) => (value) => {
  const isValidMin = !value || (!min || isOfLength(min, value))
  const isValidMax = !value || (!max || isLessThanOrEqualTo(max, value))

  return isValidMin && isValidMax ? null : msg
}

export const validatePassword = (errorMessage) => (value) => {
  const minPasswordLength = 6
  return isOfLength(minPasswordLength, value) ? null : errorMessage
}

// export const validateUrl = (errorMessage) => (value) => {
//   return isValidUrl(value) ? null : errorMessage
// }

// === HELPERS ===

// takes a list of validations
// returns first error string or undefined

// usage
// combineValidations(
//   validatePresence('you must have a password'),
//   validateLength({min: 6, msg: 'the password must be 6 chars long'})
// )(testValue)

export const combineValidations = (...validationsList) => (value) => {
  const validationFails = (validation) => (!!validation(value))
  const failingValidation = find(validationFails, validationsList)
  return failingValidation && failingValidation(value)
}
