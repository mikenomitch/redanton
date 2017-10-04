import React, { Component } from 'react'
import any from 'lodash/fp/any'

const withValidations = (validations) => (WrappedComponent) => {
  return class extends Component {
    constructor(props) {
      super(props)
      this.state = {
        errorsShowing: false
      }
    }

    showErrors = () => {
      this.setState({errorsShowing: true})
    }

    hideErrors = () => {
      this.setState({errorsShowing: false})
    }

    toggleErrors = () => {
      this.setState({errorsShowing: !this.state.errorsShowing})
    }

    errorFor = (key, val) => {
      if (this.state.errorsShowing) {
        return this.__checkPair([val, key])
      }
    }

    __checkPair([val, key]) {
      const validator = validations[key]
      return validator && validator(val)
    }

    unlessErrorsFor = (kvPairs, onNoErrors) => {
      // TODO: clean this up
      const keys = Object.keys(kvPairs)
      const toCheck = keys.map((k) => [kvPairs[k], k])

      const hasError = any(this.__checkPair, toCheck)

      if (hasError) {
        this.showErrors()
      } else {
        onNoErrors()
      }
    }

    render() {
      return (
        <WrappedComponent
          showErrors={this.showErrors}
          hideErrors={this.hideErrors}
          toggleErrors={this.toggleErrors}
          errorsShowing={this.state.errorsShowing}
          errorFor={this.errorFor}
          unlessErrorsFor={this.unlessErrorsFor}
          {...this.props}
        />
      )
    }
  }
}

export default withValidations