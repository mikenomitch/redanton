import React from 'react'
import { StackNavigator, TabNavigator } from 'react-navigation'

import NewPostScreen from '../post/NewPost'
import MainStreamScreen from '../stream/MainStream'
import ChannelScreen from '../channel/Channel'
import ChannelListScreen from '../channel/ChannelList'
import PostScreen from '../post/Post'

const TabNav = TabNavigator(
  {
    MainStreamTab: {
      screen: MainStreamScreen,
      path: '/',
      navigationOptions: {
        title: 'My Stream',
        tabBarLabel: 'Stream'
      },
    },
    ChannelsTab: {
      screen: ChannelListScreen,
      path: '/channels',
      navigationOptions: {
        title: 'Channels'
      },
    },
  },
  {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
)

const MainNav = StackNavigator({
  Root: {
    screen: TabNav,
  },
  Post: {
    screen: PostScreen,
    navigationOptions: {
      title: 'Post'
    }
  },
	Channel: {
    screen: ChannelScreen,
    navigationOptions: {
      title: 'Channel'
    }
  },
	NewPost: {
    screen: NewPostScreen,
    navigationOptions: {
      title: 'Add Post'
    }
  }
  // Profile: {
  //   screen: MyProfileScreen,
  //   path: '/people/:name',
  //   navigationOptions: ({ navigation }) => {
  //     title: `${navigation.state.params.name}'s Profile!`
  //   }
  // }
})

export default MainNav
