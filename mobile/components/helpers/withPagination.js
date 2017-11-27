import React, { Component } from 'react'

const withPagination = (WrappedComponent) => {
  return class extends Component {
    constructor(props) {
      super(props)
      this.state = {
        requestPage: 1,
        atFinalPage: false,
        lastRequestTime: null // implement later
      }
    }

    isAtEndOfData = ({data}) => {
      return data.length === 0
    }

    onEndHitCb = (requestFn) => () => {
      if (this.state.atFinalPage) { return }

      const nextPage = this.state.requestPage + 1

      requestFn(
        this.setNextRequestPageCb(nextPage),
        nextPage
      )
    }

    setNextRequestPageCb = (page) => (res) => {
      const atFinalPage = this.isAtEndOfData(res)

      this.setState({
        requestPage: page,
        atFinalPage
      })
    }

    onRefresh = () => {
      // implement later
    }

    render() {
      return (
        <WrappedComponent
          onEndHitCb={this.onEndHitCb}
          atFinalPage={this.state.atFinalPage}
          onRefresh={this.onRefresh}
          {...this.props}
        />
      )
    }
  }
}

export default withPagination