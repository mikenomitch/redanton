import React from 'react'
import { Button } from 'react-native'
import { StackNavigator, TabNavigator } from 'react-navigation'

import MainStreamScreen from '../stream/MainStream'

import ChannelScreen from '../channel/Channel'
import ChannelListScreen from '../channel/ChannelList'

import PostScreen from '../post/Post'
import NewPostScreen from '../post/NewPost'
import EditPostScreen from '../post/EditPost'
import PostPreviewScreen from '../post/PostPreview'

import PostChatScreen from '../chat/PostChat'

// ==============
//    CHILDREN
// ==============

const NewPostButton = (props) => (
  <Button title="+ Post" onPress={() => props.navigation.navigate('NewPost')} />
)

// ===============
//     TAB NAV
// ===============

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

// ===============
//    STACK NAV
// ===============

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
    navigationOptions: ({navigation}) => ({
      title: 'Chat: ' + navigation.state.params.post.title
    })
  },
  PostPreview: {
    screen: PostPreviewScreen,
    path: '/posts/:id/preview',
    navigationOptions: ({navigation}) => ({
      title: navigation.state.params.post.title
    })
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
  },
  EditPost: {
    screen: EditPostScreen,
    navigationOptions: {
      title: 'Edit Post'
    }
  },
})

export default MainNav
