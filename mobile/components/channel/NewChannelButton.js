import React from 'react'
import { connect } from 'react-redux'

import LinkButton from '../ui/LinkButton'
import ActionButton from '../ui/ActionButton'
import withDebouncedNav from '../helpers/withDebouncedNav'

const NewChannelButton = (props) => {
  const onPress = () => props.debouncedNav('NewChannel', {clubId: props.clubId})
  return props.actionButton
    ? <ActionButton onPress={onPress}> Add Channel </ActionButton>
    : !props.hide && <LinkButton title="+ Channel" onPress={onPress} />
}

const mapStateToProps = (state) => {
  const hasClubs = Object.keys(state.clubs).length
  return { hide: !hasClubs }
}

export default connect(
  mapStateToProps, null
)(
  withDebouncedNav(NewChannelButton)
)
