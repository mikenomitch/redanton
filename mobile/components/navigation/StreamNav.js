import { StackNavigator } from 'react-navigation'

import StreamScreen from '../stream/Stream'
import PostScreen from '../post/Post'

const StreamNavigator = StackNavigator({
  Home: { screen: StreamScreen },
  Post: { screen: PostScreen },
})

export default StreamNavigator