import React, { Component } from 'react';
import { View, Text, Platform, StatusBar } from 'react-native';
import { RootNavigator } from './routes'


export default class App extends Component {
  render() {
    return (
      <View  style={{ flex: 1 }}>
        <StatusBar barStyle={'light-content'} />
        <RootNavigator />
      </View>
    );
  }
}
