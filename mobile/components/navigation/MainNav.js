import React from 'react'
import { StackNavigator, TabNavigator } from 'react-navigation'

import MainStreamScreen from '../stream/MainStream'

import SettingsScreen from '../settings/Settings'
import EditUserScreen from '../user/EditUser'

import TagListScreen from '../tag/TagList'
import TagScreen from '../tag/Tag'

import EditPostScreen from '../post/EditPost'
import NewPostScreen from '../post/NewPost'

import ClubListScreen from '../club/ClubList'
import ClubScreen from '../club/Club'
import ClubManagementScreen from '../club/ClubManagement'
import EditClubScreen from '../club/EditClub'
import NewClubScreen from '../club/NewClub'
import InviteScreen from '../club/Invite'

import ChatScreen from '../chat/ChatScreen'

import ConnectedHeader from '../ui/ConnectedHeader'

import withOSPermissions from '../helpers/withOSPermissions'

import { colors } from '../styleConstants'

import NewClubButton from '../club/NewClubButton'
import ManageClubButton from '../club/ManageClubButton'
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
        headerBackTitle: null,
        tabBarLabel: 'Stream',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="th-list" size={20} color={tintColor} />
        ),
      })
    },
    ClubsTab: {
      screen: ClubListScreen,
      path: '/clubs',
      navigationOptions:  ({navigation}) => ({
        title: 'Clubs',
        tabBarLabel: 'Clubs',
        headerBackTitle: null,
        headerRight: (<NewClubButton navigation={navigation} />),
        tabBarIcon: ({ tintColor }) => (
          <Icon name="group" size={20} color={tintColor} />
        ),
      })
    },
    TagsTab: {
      screen: TagListScreen,
      path: '/tags',
      navigationOptions:  () => ({
        title: 'Tags',
        tabBarLabel: 'Tags',
        headerBackTitle: null,
        tabBarIcon: ({ tintColor }) => (
          <Icon name="tags" size={20} color={tintColor} />
        ),
      })
    },
    SettingsTab: {
      screen: SettingsScreen,
      path: '/settings',
      navigationOptions: {
        title: 'Settings',
        headerBackTitle: null,
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
    screen: MainStreamScreen
  }
)

// ===============
//    STACK NAV
// ===============

const MainNav = StackNavigator({
  Root: {
    screen: TabNav
  },
  PostChat: {
    screen: ChatScreen,
    path: '/posts/:id/chat',
    navigationOptions: ({navigation}) => ({
      headerTitle: (<ConnectedHeader resourceKey={navigation.state.params.post.id} stateKey="posts" defaultTitle="post chat" />),
      headerBackTitle: null
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
  Tag: {
    screen: TagScreen,
    navigationOptions: ({navigation}) => ({
      headerTitle: (<ConnectedHeader resourceKey={navigation.state.params.tag.id} stateKey="tags" defaultTitle="tags" />),
      headerRight: (<NewPostButton navigation={navigation} />)
    })
  },
  Club: {
    screen: ClubScreen,
    navigationOptions: ({navigation}) => ({
      headerTitle: (<ConnectedHeader resourceKey={navigation.state.params.club.id} stateKey="clubs" defaultTitle="club" />),
      headerRight: (<ManageClubButton club={navigation.state.params.club} navigation={navigation} />)
    })
  },
  ClubManagement: {
    screen: ClubManagementScreen,
    navigationOptions: ({navigation}) => ({
      headerTitle: (<ConnectedHeader resourceKey={navigation.state.params.club.id} stateKey="clubs" defaultTitle="club" />)
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
},
{
  navigationOptions: {}
})

export default withOSPermissions(MainNav)
