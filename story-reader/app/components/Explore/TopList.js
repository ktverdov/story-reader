import React, { Component } from 'react';
import { View, FlatList, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import Dash from 'react-native-dash';
import Reader from '../../screens/Reader';


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


export default class TopList extends Component {
  state = {
    dataSource: [],
    loading: true
  }

  actionOnItem(storyId) {
    this.props.navigation.navigate('Read', {storyId: storyId})
  }

  componentDidMount(){
    fetch("http://35.208.63.74:5000/api/v1/stories/top")
      .then(response => response.json())
      .then((responseJson)=> {
        this.setState({
          loading: false,
          dataSource: responseJson
        })
    })
      .catch(error=>console.log(error))
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
