import { StackNavigator } from 'react-navigation'

import MainStream from '../stream/MainStream'
import PostScreen from '../post/Post'

const StreamNavigator = StackNavigator({
  Home: { screen: MainStream },
  Post: { screen: PostScreen },
})

export default StreamNavigator