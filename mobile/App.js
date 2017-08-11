import React, {Component} from 'react'
import {Provider} from 'react-redux'

import configureStore from './store/configureStore'
import Main from './components/Main'

import {authThunks} from './data/auth'

const store = configureStore()

export default class App extends Component {
  componentDidMount(){
    store.dispatch(authThunks.loadInitialAuth())
  }

  render() {
    return (
      <Provider store={store}>
        <Main/>
      </Provider>
    )
  }
}
