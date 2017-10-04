import find from 'lodash/fp/find'

// === VALUE CHECKS===

const hasPresence = (value) => {
  return !!value
}

const isOfLength = (minLength, value) => {
  return value && value.length >= minLength
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
//   lengthCheck('the password must be 6 chars long')
// )(testValue)

export const combineValidations = (checkList) => (value) => {
  const validationFails = (validation) => (!!validation(value))
  const failingValidation = find(validationFails, checkList)
  return failingValidation && failingValidation(value)
}
