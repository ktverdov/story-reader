import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Button } from 'react-native-elements';

import RecommendList from '../components/Explore/RecommendList';
import TopList from '../components/Explore/TopList';
import Search from '../components/Explore/Search';




export default class Explore extends Component {

  doSearch = time_limit => {
     fetch(`http://35.208.63.74:5000/api/v1/stories/search/?limit=${time_limit}`)
      .then(response => response.json())
      .then((responseJson)=> {
        this.props.navigation.navigate('SearchModal', {data: responseJson})
    })
      .catch(error=>console.log(error))
  };

  render() {
    return (
      <ScrollView>
        <Text style={styles.regionHeader}>
          Recommended books:
        </Text>
        <RecommendList navigation={this.props.navigation}/>

        <Text style={styles.regionHeader}>
          Search your books:
        </Text>

        <Search navigation={this.props.navigation}/>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonRowFirst}>
            <Button style={{"flex": 1}} title=" 5 min " type="outline" onPress={() => this.doSearch(5)}/>
            <Button style={{"flex": 1}} title=" 15 min " type="outline" onPress={() => this.doSearch(15)}/>
            <Button style={{"flex": 1}} title=" 30 min " type="outline" onPress={() => this.doSearch(30)}/>
          </View>
          <View style={styles.buttonRowSecond}>
            <Button title="60 min " type="outline" onPress={() => this.doSearch(70)}/>
          </View>

        </View>

        <Text style={styles.regionHeader}>
          Popular books:
        </Text>

        <TopList navigation={this.props.navigation}/>
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
  regionHeader: {
    fontSize: 24,
    fontWeight: "700",
    paddingHorizontal: "2%"
  },
  buttonContainer: {
    marginLeft: "5%",
    marginRight: "5%", 
    marginTop: 5
  }, 
  buttonRowFirst: {
    flex: 1, 
    flexDirection: "row", 
    justifyContent: "space-between"
  }, 
  buttonRowSecond: {
    flexDirection: "row", 
    "marginTop": 5
  }
});