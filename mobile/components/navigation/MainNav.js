import React from 'react'
import { Button } from 'react-native'
import { StackNavigator, TabNavigator } from 'react-navigation'

import MainStreamScreen from '../stream/MainStream'

import ChannelScreen from '../channel/Channel'
import ChannelListScreen from '../channel/ChannelList'

import PostScreen from '../post/Post'
import NewPostScreen from '../post/NewPost'

const NewPostButton = (props) => (
  <Button title="+ Post" onPress={() => props.navigation.navigate('NewPost')} />
)

const TabNav = TabNavigator(
  {
    MainStreamTab: {
      screen: MainStreamScreen,
      path: '/',
      navigationOptions: ({navigation}) => ({
        title: 'My Stream',
        tabBarLabel: 'Stream',
        headerRight: (<NewPostButton navigation={navigation} />)
      })
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
    navigationOptions: ({navigation}) => ({
      title: 'Channel',
      headerRight: (<NewPostButton navigation={navigation} />)
    })
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
