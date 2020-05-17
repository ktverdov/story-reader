import React, { Component } from 'react';
import { View, FlatList, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import Dash from 'react-native-dash';
import Reader from '../../screens/Reader';
import { AsyncStorage } from 'react-native';


function Item({itemData}) {
  return (
    <View style={styles.item}>
      <View height={"40%"}>
        <Text numberOfLines={2} style={styles.bookAuthor}> {itemData.author} </Text>
      </View>
      <Dash dashGap={5} dashLength={1} dashThickness={1} style={{width: 110}}/>
      <View height={"60%"}>
        <Text numberOfLines={4} style={styles.bookTitle}> {itemData.title} </Text>
      </View>
    </View>
  );
}


export default class RecommendList extends Component {
  state = {
    dataSource: "",
    loading: true,
    bearer_token: ""
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
  
  APICallFunction() {
    var bearer = `Bearer ${this.state.bearer_token}`
    fetch("http://35.208.63.74:5000/api/v1/stories/recommend", {
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
        dataSource: responseJson
      })
    })
    .catch(error=>console.log(error))
  }

  componentDidMount() {
    this.getAuthToken()
  }

  render() {
    return (
      <FlatList
        style={styles.list}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        data={this.state.dataSource}
        renderItem={ ({item}) => (
          <TouchableWithoutFeedback onPress={ () => this.actionOnItem(item.story_id)}>
            <View>
              <Item itemData={item} />
            </View>
          </TouchableWithoutFeedback> )}
        keyExtractor={ item => item.story_id.toString() }
      />
    );
  }
}


const styles = StyleSheet.create({
  list: {
    height: 130,
  },
  item: {
    width: 110,
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 0.3, 
    margin: 4
  },
  bookAuthor: {
    fontSize: 16,
    fontWeight: "600",
    paddingTop: "2%",
    paddingLeft: "5%"
  },
  bookTitle: {
    fontStyle: "italic",
    paddingHorizontal: "3%"
  }
});
