import React from 'react'
import { TabNavigator } from 'react-navigation'

import StreamNavigator from './StreamNav'
import ChannelNavigator from './ChannelNav'
import SimpleChat from '../chat/SimpleChat'

const MainNav = TabNavigator({
  Stream: { screen: StreamNavigator },
  Channels: { screen: ChannelNavigator },
  Chat: { screen: SimpleChat }
})

MainNav.navigationOptions = {
  title: 'Danton',
}

export default MainNav
