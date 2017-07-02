import { StackNavigator } from 'react-navigation'

import ChannelScreen from '../channel/Channel'
import ChannelListScreen from '../channel/ChannelList'

const ChannelNavigator = StackNavigator({
  Home: { screen: ChannelListScreen },
  Channel: { screen: ChannelScreen },
})

export default ChannelNavigator