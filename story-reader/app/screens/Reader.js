import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { AsyncStorage } from 'react-native';
import { Header, Icon } from 'react-native-elements';


const HeaderCentral = (props) => {
  return (
    <View>
      <Text style={{fontSize: 16 }} numberOfLines={1}> 
        { props.author } 
      </Text>
      
      <Text numberOfLines={1}>  
        { props.title }
      </Text>
    </View>
  );
}

const HeaderRight = (props) => {
  return (
    <Icon name={ props.isBookmarked ? "bookmark" : "bookmark-border"} 
      type="material" 
      onPress={() => props.changeBookmarked()}/>
  );
}

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};


export default class Reader extends Component {
  state = {
    story: {},
    isBookmarked: false,
    bearer_token: ""
  };

  changeBookmarked = () => {
    var bearer = `Bearer ${this.state.bearer_token}`

    if (this.state.isBookmarked) {
      var method = 'DELETE'
    } else {
      var method = 'PUT'
    }

    fetch('http://35.208.63.74:5000/api/v1/stories/favorites', {
        method: method,
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({
            story_id: this.state.story.story_id
        })
    })

    this.setState({isBookmarked: !this.state.isBookmarked});
  };

  addToHistory = () => {
    var bearer = `Bearer ${this.state.bearer_token}`

    fetch('http://35.208.63.74:5000/api/v1/stories/history', {
        method: 'PUT',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({
            story_id: this.state.story.story_id
        })
    })
  };

  getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      this.setState({bearer_token: token});
    } catch (error) {}
  };

  componentDidUpdate(prevProps) {
    try {
      var { storyId } = this.props.route.params
    } catch (error) {
      var { storyId } = "undefined"
    }
    
    if ( typeof storyId !== "undefined" && storyId !== this.state.story.story_id ) {
      fetch("http://35.208.63.74:5000/api/v1/stories/" + storyId.toString())
        .then(response => response.json())
        .then((responseJson)=> {
          this.setState({
            story: responseJson, 
            isBookmarked: false
          })
        })
        .catch(error=>console.log(error))
    }
  }

  componentDidMount(){
    this.getAuthToken()
    
    try {
      var { storyId } = this.props.route.params
    } catch (error) {
      console.log(1)
      var { storyId } = "undefined"
    }

    if (typeof storyId !== "undefined") {
      fetch("http://35.208.63.74:5000/api/v1/stories/" + storyId.toString())
        .then(response => response.json())
        .then((responseJson)=> {
          this.setState({
            story: responseJson
          })
      })
        .catch(error=>console.log(error))
    }
  }

  render() {
    return (
      <View style={styles.mainView}>
        <Header containerStyle={styles.headerContainer}
          centerComponent={<HeaderCentral author={this.state.story.author} 
                                          title={this.state.story.title}/>}
          rightComponent={<HeaderRight isBookmarked={this.state.isBookmarked}
                                        changeBookmarked={this.changeBookmarked}/>}
          leftContainerStyle={styles.leftContainer}/>

        <ScrollView style={styles.scrollView}
                    onScroll={({nativeEvent}) => { 
                      if (isCloseToBottom(nativeEvent)) { 
                        this.addToHistory()
                      }}} 
                    scrollEventThrottle={400}>

          <Text>{this.state.story.content}</Text>
        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  mainView: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  scrollView: {
     margin: "2%"
  },
  headerContainer: {
    paddingTop: 0, 
    height: "15%", 
    backgroundColor: "#B1D9F1"
  },
  leftContainer: {
    flex:0
  }
});