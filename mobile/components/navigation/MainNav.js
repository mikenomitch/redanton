import React from 'react'
import { Button } from 'react-native'
import { StackNavigator, TabNavigator } from 'react-navigation'

import MainStreamScreen from '../stream/MainStream'

import SettingsScreen from '../settings/Settings'
import EditUserScreen from '../user/EditUser'

import ChannelListScreen from '../channel/ChannelList'
import ChannelScreen from '../channel/Channel'
import EditChannelScreen from '../channel/EditChannel'
import NewChannelScreen from '../channel/NewChannel'

import PostScreen from '../post/Post'
import EditPostScreen from '../post/EditPost'
import NewPostScreen from '../post/NewPost'

import ClubScreen from '../club/Club'
import EditClubScreen from '../club/EditClub'
import NewClubScreen from '../club/NewClub'
import InviteScreen from '../club/Invite'

import PostChatScreen from '../chat/PostChat'

import Icon from 'react-native-vector-icons/FontAwesome'

// ==============
//    CHILDREN
// ==============

const NewPostButton = (props) => {
  const channel = props.navigation.state.params && props.navigation.state.params.channel
  return <Button title="+ Post" onPress={() => props.navigation.navigate('NewPost', {channel: channel})} />
}

const NewChannelButton = (props) => (
  <Button title="+ Channel" onPress={() => props.navigation.navigate('NewChannel')} />
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
        headerRight: (<NewPostButton navigation={navigation} />),
        tabBarLabel: 'Stream',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="th-list" size={20} color={tintColor} />
        ),
      })
    },
    ChannelsTab: {
      screen: ChannelListScreen,
      path: '/channels',
      navigationOptions:  ({navigation}) => ({
        title: 'My Channels',
        tabBarLabel: 'Channels',
        headerRight: (<NewChannelButton navigation={navigation} />),
        tabBarIcon: ({ tintColor }) => (
          <Icon name="filter" size={20} color={tintColor} />
        ),
      })
    },
    SettingsTab: {
      screen: SettingsScreen,
      path: '/settings',
      navigationOptions: {
        title: 'Settings',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="gear" size={20} color={tintColor} />
        )
      }
    }
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
  Channel: {
    screen: ChannelScreen,
    navigationOptions: ({navigation}) => ({
      title: navigation.state.params.channel.name || 'Channel',
      headerRight: (<NewPostButton navigation={navigation} />)
    })
  },
  NewChannel: {
    screen: NewChannelScreen,
    navigationOptions: {
      title: 'Add Channel'
    }
  },
  EditChannel: {
    screen: EditChannelScreen,
    navigationOptions: {
      title: 'Edit Channel'
    }
  },
  Club: {
    screen: ClubScreen,
    navigationOptions: ({navigation}) => ({
      title: navigation.state.params.club.name || 'Club'
    })
  },
  NewClub: {
    screen: NewClubScreen,
    navigationOptions: {
      title: 'Create Club'
    }
  },
  EditClub: {
    screen: EditClubScreen,
    navigationOptions: {
      title: 'Edit Club'
    }
  },
  Invite: {
    screen: InviteScreen,
    navigationOptions: {
      title: 'Invite To Club'
    }
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
  EditUser: {
    screen: EditUserScreen,
    navigationOptions: {
      title: 'Edit User'
    }
  }
})

export default MainNav
