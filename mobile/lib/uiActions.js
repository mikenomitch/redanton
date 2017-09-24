import {
  Alert
} from 'react-native'

function noop () {}

export const alertMessage = (title, message) => {
  Alert.alert(
    title,
    message, [{
      text: 'OK',
      onPress: noop
    }], {
      cancelable: false
    }
  )
}

export const confirmMessage = (title, message, onPress) => {
  Alert.alert(
    title,
    message, [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'OK',
        onPress: onPress
      },
    ], {
      cancelable: true
    }
  )
}