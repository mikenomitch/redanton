import React from 'react'
import { StackNavigator, TabNavigator } from 'react-navigation'

import MainStreamScreen from '../stream/MainStream'

import SettingsScreen from '../settings/Settings'
import EditUserScreen from '../user/EditUser'

import ChannelListScreen from '../channel/ChannelList'
import ChannelScreen from '../channel/Channel'
import EditChannelScreen from '../channel/EditChannel'
import NewChannelScreen from '../channel/NewChannel'

import EditPostScreen from '../post/EditPost'
import NewPostScreen from '../post/NewPost'

import ClubScreen from '../club/Club'
import EditClubScreen from '../club/EditClub'
import NewClubScreen from '../club/NewClub'
import InviteScreen from '../club/Invite'

import ChatScreen from '../chat/ChatScreen'

import withOSPermissions from '../helpers/withOSPermissions'

import NewChannelButton from '../channel/NewChannelButton'
import NewPostButton from '../post/NewPostButton'
import Icon from 'react-native-vector-icons/FontAwesome'

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
  PostChat: {
    screen: ChatScreen,
    path: '/posts/:id/chat',
    navigationOptions: ({navigation}) => ({
      title: navigation.state.params.post.title
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
  Channel: {
    screen: ChannelScreen,
    navigationOptions: ({navigation}) => ({
      title: (<ChannelTitle navigation={navigation} />),
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
  EditUser: {
    screen: EditUserScreen,
    navigationOptions: {
      title: 'Edit User'
    }
  }
})

export default withOSPermissions(MainNav)
