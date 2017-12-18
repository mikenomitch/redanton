import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import { Provider } from 'react-redux'

import configureStore from './store/configureStore'
import Main from './components/Main'

const store = configureStore()

export default class App extends Component {
  render() {
    return (
      <View style={{height: '100%', width: '100%'}}>
        <StatusBar barStyle="dark-content" />
        <Provider store={store}>
          <Main />
        </Provider>
      </View>
    )
  }
}
