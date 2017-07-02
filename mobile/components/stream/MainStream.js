import React from 'react'
import Stream from './Stream'

class MainStream extends React.Component {
  static navigationOptions = {
    title: 'Your Stream',
  }

	postsResponse () {
		return {"data":
			[
				{"title":"Early Bezoz Interview","id":1,"description":"Kind of cool. Would not have thought he'd be one of the richest people in the world."},
			  {"title":"How to Be Miserable","id":2,"description":"Interesting take on the \"how to be happy\" arguments."},
				{"title":"Meditations on Moloch","id":3,"description":"This is kind of weird but in my opinion really interesting"},
				{"title":"Considerations on Cost Disease","id":4,"description":"Interesting non-partisan take on rising costs."}
			]
		}
	}

  render() {
		const streamContent = this.postsResponse()["data"]

    return (
			<Stream navigation={this.props.navigation} content={streamContent}/>
		)
	}
}

export default MainStream