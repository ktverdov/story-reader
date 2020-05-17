import React, { Component } from 'react';
import { View, Text } from 'react-native';
import StoriesListFav from "../../components/StoriesListFav"

export default class Favorites extends Component {
  render() {
    return (
      <View >
        <StoriesListFav url="http://35.208.63.74:5000/api/v1/stories/favorites"
                      navigation={this.props.navigation}/>
      </View>
    );
  }
}