import React, { PureComponent } from 'react'
import {
  ScrollView,
  StyleSheet,
  View
} from 'react-native'
import { compose } from 'redux'
import { connect } from 'react-redux'
import merge from 'lodash/fp/merge'

import { spacing } from '../styleConstants'

import {
  validatePresence,
  validateLength,
  combineValidations
} from '../../lib/validations'
import withValidation from '../helpers/withValidation'

import ActionButton from '../ui/ActionButton'
import BasicTextInput from '../ui/BasicTextInput'
import ModalSelector from '../ui/ModalSelector'

import { createPost } from '../../data/posts'

import EditPostInfo from './EditPostInfo'

const defaultPostInfo = {
	url: '',
	title: '',
	description: '',
	club: ''
}

const defaultState = {
  showErrors: false,
  postInfo: defaultPostInfo
}

// ===============
//     STYLES
// ===============

const styles = StyleSheet.create({
  root: {
    padding: spacing.container
  },
  modalSelector: {
    borderRadius: 0
  }
})

// ===============
//   VALIDATIONS
// ===============

const validations = {
  title: combineValidations(
    validatePresence('you must have a title'),
    validateLength({min: 1, max: 150, msg: 'must be between 1 and 150 characters'})
  ),
  club: validatePresence('you must select a club'),
}

// ===============
//    PRESENTER
// ===============

class NewPost extends PureComponent {

  // lifecycle

	constructor(props){
		super(props)
    this.state = merge(
      defaultState,
      {postInfo: {club: this.givenClub().id}}
    )
  }

  // helpers

  get clubs () {
    return Object.values(this.props.clubs)
  }

	clubData() {
		return this.clubs.map(
      (club) => ({ key: club.id, label: club.name })
    )
  }

  givenClub () {
    return this.props.navigation.state.params.club || {}
  }

  // actions

  onPostClick = () => {
    this.props.unlessErrors(
      {club: this.state.postInfo.club, title: this.state.postInfo.title},
      this.createNewPost
    )
  }

	createNewPost = () => {
    const {navigate, goBack} = this.props.navigation

    const onPostSuccess = (res) => {
      this.clearState()
			goBack()
    }

    this.props.createPost(this.state.postInfo, onPostSuccess)
	}

	setPostState = (newKV) => {
    const postInfo = Object.assign({}, this.state.postInfo, newKV)
		this.setState({postInfo})
	}

  clearState = () => {
    this.props.hideErrors()
    this.setState(defaultState)
  }

  // rendering

  render() {
    return (
      <View style={styles.root}>
        <ScrollView>
          <ModalSelector
            style={styles.modalSelector}
            data={this.clubData()}
            initValue={this.givenClub().name || "select club"}
            onChange={(option)=> this.setPostState({club: option.key})}
            error={this.props.errorFor('club', this.state.postInfo.club)}
          />
          <EditPostInfo
            errorFor={this.props.errorFor}
            setPostState={this.setPostState}
            postInfo={this.state.postInfo}
          />
          <BasicTextInput
            multiline
            height={40}
            label="first chat message"
            value={this.state.postInfo.message}
            onChangeText={(message) => this.setPostState({message})}
          />
          <ActionButton onPress={this.onPostClick}>
            post it
          </ActionButton>
        </ScrollView>
			</View>
		)
  }
}

// ===============
//   CONNECTION
// ===============

const mapStateToProps = (state) => {
  return { clubs: state.clubs }
}

const dispatchableActions = { createPost }

export default compose(
  withValidation(validations),
  connect(mapStateToProps, dispatchableActions)
)(NewPost)
