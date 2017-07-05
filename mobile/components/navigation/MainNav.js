import React from 'react'
import { Button } from 'react-native'
import { StackNavigator, TabNavigator } from 'react-navigation'

import MainStreamScreen from '../stream/MainStream'

import ChannelScreen from '../channel/Channel'
import ChannelListScreen from '../channel/ChannelList'

import PostScreen from '../post/Post'
import NewPostScreen from '../post/NewPost'
import PostPreviewScreen from '../post/PostPreview'

import PostChatScreen from '../chat/PostChat'

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
    path: '/posts/:id',
    navigationOptions: ({navigation}) => ({
      title: navigation.state.params.post.title || 'Post'
    })
  },
  PostChat: {
    screen: PostChatScreen,
    path: '/posts/:id/chat',
    navigationOptions: () => ({
      title: 'Discussion'
    })
  },
  PostPreview: {
    screen: PostPreviewScreen,
    path: '/posts/:id/preview',
    navigationOptions: {
      title:'Post Preview'
    }
  },
  Channel: {
    screen: ChannelScreen,
    navigationOptions: ({navigation}) => ({
      title: navigation.state.params.channel.name || 'Channel',
      headerRight: (<NewPostButton navigation={navigation} />)
    })
  },
  NewPost: {
    screen: NewPostScreen,
    navigationOptions: {
      title: 'Add Post'
    }
  }
})

export default MainNav
