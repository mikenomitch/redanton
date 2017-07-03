import React from 'react'
import Stream from './Stream'

import { get } from '../../lib/fetcher'

class MainStream extends React.Component {
  static navigationOptions = {
  	title: 'Your Stream'
  }

  constructor(props) {
  	super(props)
  	this.state = {
  		posts: []
  	}
  }

  componentDidMount() {
  	get('/front').then((data) => {
  		this.setState({
  			posts: data["data"]
  		})
  	})
  }

  render() {
		const streamContent = this.state.posts
    return <Stream navigation={this.props.navigation} content={streamContent}/>
	}
}

export default MainStream
