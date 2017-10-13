import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { connect } from 'react-redux'

import { font } from '../styleConstants'

const styles = StyleSheet.create({
  text: {
    fontSize: font.large,
    fontWeight: font.heavyWeight,
    overflow: 'hidden'
  }
})

const HeaderTitle = (props) => (
  <Text numberOfLines={1} style={styles.text}> {props.name} </Text>
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
