import React, { Component} from 'react'
import Stream from './Stream'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getFrontPage } from '../../data/posts'

// ===============
//    PRESENTER
// ===============

class MainStream extends Component {
  static navigationOptions = {
  	title: 'Your Stream'
  }

  componentDidMount() {
  	this.props.getFrontPage()
  }

  render() {
    return <Stream navigation={this.props.navigation} content={this.props.posts}/>
	}
}

// ===============
//   CONNECTION
// ===============

const mapStateToProps = (state) => {
  return {
    posts: Object.values(state.posts)
  }
}

const mapDispatchToProps = (dispatch) => {
  return	{
    getFrontPage: bindActionCreators(getFrontPage, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainStream)
