import React from 'react';

import { Platform, StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'; 

import { Icon } from 'react-native-elements';

import Explore from './screens/Explore';
import Reader from './screens/Reader';

import History from './screens/Profile/History';
import Favorites from './screens/Profile/Favorites';

import Settings from './screens/Settings';

import SearchList from './screens/SearchList';

import AuthScreen from './screens/Auth'


function getIconName (routeName) {
  switch(routeName) {
    case 'Explore':
      return "ios-search";
    case 'Read':
      return "ios-play";
    case 'Personal':
      return "ios-person";
    case 'Settings':
      return "ios-options";
  }
}

function getIcon(routeName, focused, color, size) {
  const iconName = getIconName(routeName);
  return <Icon name={iconName} type="ionicon" size={size} color={color} />;
}


const PersonalTab = createMaterialTopTabNavigator();

function PersonalNavigator() {
  return (
    <PersonalTab.Navigator 
      // cardStyle={ Platform.OS === 'ios' ? 0 : StatusBar.currentHeight }
    >
      <PersonalTab.Screen name="Latest" component={History} />
      <PersonalTab.Screen name="Favorites" component={Favorites} />
    </PersonalTab.Navigator>
  );
}

const MainTab = createBottomTabNavigator();

function MainNavigator() {
  return (
    <MainTab.Navigator
      screenOptions={ ({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => getIcon(route.name, focused, color, size)})}
      
      tabBarOptions={{
          activeTintColor: 'dodgerblue',
          inactiveTintColor: 'gray',
        }
      }
    >
      <MainTab.Screen name="Explore" component={Explore} />
      <MainTab.Screen name="Read" component={Reader} />
      <MainTab.Screen name="Personal" component={PersonalNavigator} />
      <MainTab.Screen name="Settings" component={Settings} />
    </MainTab.Navigator>
  );
}


const RootTab = createStackNavigator();

export const RootNavigator = function() {
  return (
    <NavigationContainer>
      <RootTab.Navigator mode="modal">
        <RootTab.Screen name="AuthScreen" component={AuthScreen}  options={{ headerShown: false }} />
        <RootTab.Screen name="Main" component={MainNavigator}  options={{ headerShown: false }} />
        <RootTab.Screen name="SearchModal" component={SearchList} />
      </RootTab.Navigator>
    </NavigationContainer>
  );
};