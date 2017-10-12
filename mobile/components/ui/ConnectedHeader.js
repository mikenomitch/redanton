import React from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'

const HeaderTitle = (props) => (
  <Text> {props.name} </Text>
)

const mapStateToProps = (state, props) => {
  const resourceHash = state[props.stateKey]
  const resource = resourceHash && resourceHash[props.resourceKey]
  return {
    name: resource && (resource.name || resource.title) || props.defaultTitle
  }
}

export default connect(
  mapStateToProps, null
)(HeaderTitle)
