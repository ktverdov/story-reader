import React, { Component } from 'react';
import { View, Text } from 'react-native';
import StoriesList from "../../components/StoriesList"

export default class History extends Component {
  render() {
    return (
      <View >
        <StoriesList url="http://35.208.63.74:5000/api/v1/stories/history"
                      navigation={this.props.navigation}/>
      </View>
    );
  }
}