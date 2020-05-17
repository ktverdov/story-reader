import React, { Component } from 'react';
import { SearchBar } from 'react-native-elements';


export default class Search extends Component {
   state = {
    search: '',
  };

  updateSearch = search => {
    this.setState({ search });
  };

  doSearch = () => {
    fetch(`http://35.208.63.74:5000/api/v1/stories/search/?text=${this.state.search}`)
      .then(response => response.json())
      .then((responseJson)=> {
        console.log(responseJson)
        this.props.navigation.navigate('SearchModal', {data: responseJson})
    })
      .catch(error=>console.log(error))
  };

  render() {
    const { search } = this.state;

    return (
      <SearchBar 
        placeholder="Search by title or author"
        onChangeText={this.updateSearch}
        value={search}
        platform="android"
        onSubmitEditing={this.doSearch}
        />
    );
  }
}