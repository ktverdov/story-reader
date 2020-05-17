import React, { Component } from 'react';
import { View, FlatList, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import Reader from './Reader';


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


export default class SearchList extends Component {
  state = {
    dataSource: {}
  }

  actionOnItem(storyId) {
    this.props.navigation.navigate('Read', {storyId: storyId})
  }

  componentDidMount(){
    var { data } = this.props.route.params
    this.setState({
      dataSource: data
    })
  }

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

  render() {
    return (
      <FlatList style={styles.list}
        showsVerticalScrollIndicator={false}
        horizontal={false}
        data={this.state.dataSource}
        renderItem={ ({item}) => (
          <TouchableWithoutFeedback onPress={ () => this.actionOnItem(item.story_id)}>
            <View>
              <Item itemData={item} />
            </View>
          </TouchableWithoutFeedback> )}
        keyExtractor={ item => item.story_id.toString() }
        ItemSeparatorComponent={this.renderSeparator}
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