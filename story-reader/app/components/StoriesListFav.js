import React, { Component } from 'react';
import { View, FlatList, Text, TouchableWithoutFeedback, RefreshControl, StyleSheet } from 'react-native';
import { AsyncStorage } from 'react-native';
import Dash from 'react-native-dash';
import Reader from '../screens/Reader';


function Item({itemData}) {
  return (
    <View >
      <Text numberOfLines={2} style={styles.itemTitle}> 
        {itemData.author}. {itemData.title} 
      </Text>
      <Text > {itemData.short_content.replace(/\n/g, " ")} ... </Text>
      <Text style={styles.itemTime}> {itemData.reading_time_min} min </Text>
    </View>
  );
}


export default class StoriesListFav extends Component {
  state = {
    dataSource: [],
    loading: true, 
    bearer_token: "",
    isFetching: false, 
  };

  onRefresh() {
     this.setState({ isFetching: true }, () => this.APICallFunction() );
  }

  actionOnItem(storyId) {
    this.props.navigation.navigate('Read', {storyId: storyId})
  }

  getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      this.setState({bearer_token: token}, 
        () => this.APICallFunction());
    } catch (error) {}
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  APICallFunction() {
    var bearer = `Bearer ${this.state.bearer_token}`
    fetch(this.props.url, {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
          }
    })
    .then(response => response.json())
    .then((responseJson)=> {
      this.setState({
        loading: false,
        dataSource: responseJson, 
        isFetching: false
      })
    })
    .catch(error=>console.log(error))
  }

  async APICallFunctionAwait() {
    var bearer = `Bearer ${this.state.bearer_token}`
    await fetch(this.props.url, {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
          }
    })
    .then(response => response.json())
    .then((responseJson)=> {
      this.setState({
        loading: false,
        dataSource: responseJson, 
        isFetching: false
      })
    })
    .catch(error=>console.log(error))
  }

  componentDidMount() {
    this.getAuthToken()

    var a = setTimeout(() => { setInterval(()=> { 
      if (this.state.dataSource.length === 0) {
        this.APICallFunctionAwait()
      }}, 3000) }, 2000);
  }

  render() {
    return (
      <FlatList style={styles.list}
        showsVerticalScrollIndicator={false}
        horizontal={false}
        data={this.state.dataSource}
        extraData={this.state.dataSource}
        renderItem={ ({item}) => (
          <TouchableWithoutFeedback onPress={ () => this.actionOnItem(item.story_id)}>
            <View>
              <Item itemData={item} />
            </View>
          </TouchableWithoutFeedback> )}
        keyExtractor={ item => item.story_id.toString() }
        ItemSeparatorComponent={this.renderSeparator}
        onRefresh={() => this.onRefresh()}
        refreshing={this.state.isFetching}
      />
    );
  }
}


const styles = StyleSheet.create({
  list: {
    margin: "2%"
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700"
  },
  itemTime: {
    marginLeft: "80%"
  }
});