import React, { Component} from 'react'
import Stream from './Stream'

import { connect } from 'react-redux'

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

export default connect(
  mapStateToProps,
  { getFrontPage }
)(MainStream)
