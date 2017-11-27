import React, { PureComponent } from 'react'
import debounce from 'lodash/debounce'

const withDebouncedNav = (WrappedComponent) => {
  return class extends PureComponent {
    constructor(props) {
      super(props)

      this.debouncedNav = debounce(
        this.props.navigation.navigate,
        1000,
        {leading: true, trailing: false}
      )
    }

    render() {
      return (
        <WrappedComponent
          debouncedNav={this.debouncedNav}
          {...this.props}
        />
      )
    }
  }
}

export default withDebouncedNav