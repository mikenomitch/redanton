import React, { Component} from 'react'
import { connect } from 'react-redux'
import { registerPushNotifications } from '../../data/users'

const withOSPermissions = (WrappedComponent) => {
  class ExtendedClass extends Component {
    componentDidMount(){
      this.props.registerPushNotifications()
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  return connect(null, {registerPushNotifications})(ExtendedClass)
}

export default withOSPermissions