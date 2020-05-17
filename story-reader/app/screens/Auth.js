import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements'


export default class AuthScreen extends Component {
  state = {
    email: "",
    password: "",
    bearer_token: ""
  };

  handleEmail = text => {
    this.setState({ email: text });
  };

  handlePassword = text => {
    this.setState({ password: text });
  };

  handleResponseSignUp = (res) => {
    if (res.ok) {
      Alert.alert("Registration Info:", "Successfully registered! Sign In.")
    } else {
      Alert.alert("Registration Info:", "Server Error. Try another email or check password length (6)")
    }
  };

  handleResponseSignIn = (res) => {
    if (!res.ok) {
      Alert.alert("Login Info:", "Login failed")
      throw new Error("server error")
    }
  };

  storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('auth_token', token, 
                                () => this.props.navigation.navigate("Main"));
    } catch (error) {}
  };

  signUp = (email, pass) => {
    fetch("http://35.208.63.74:5000/api/v1/auth/signup", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                email: email, 
                password: pass
              })
      })
      .then(this.handleResponseSignUp)
      .catch(error=>console.log(error))
  };

  signUpNoHandle = (email, pass) => {
    fetch("http://35.208.63.74:5000/api/v1/auth/signup", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                email: email, 
                password: pass
              })
      })
      .catch(error=>console.log(error))
  };

  signIn = (email, pass) => {
    fetch("http://35.208.63.74:5000/api/v1/auth/login", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                email: email, 
                password: pass
              })
      })
      .then(response => {
        this.handleResponseSignIn(response);
        response.json().then(responseJson => {
          this.storeToken(responseJson["token"]);
        });
      })
      .catch(error=>console.log(error))
    
  };

  skipSignIn = () => {
    var creds = [...Array(10)].map(i=>(~~(Math.random()*36)).toString(36)).join('')
    var creds_email = `${creds}@${creds}.com`
    this.signUpNoHandle(creds_email, creds)
    setTimeout(() => { this.signIn(creds_email, creds); }, 2000);
  };

  getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token != null) {
        this.setState({bearer_token: token}, 
          () => this.props.navigation.navigate("Main"));
      }
    } catch (error) {}
  };

  componentDidMount() {
    this.getAuthToken()
  }


  render() {
    return(
      <View style={styles.container}>
        <TextInput style={styles.input} placeholder="Email" onChangeText={this.handleEmail} />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} 
                    onChangeText={this.handlePassword}/>
        
        <TouchableOpacity style={styles.button} 
                          onPress={() => this.signUp(this.state.email, this.state.password)}>
          <Text style={styles.buttonText}> Sign Up </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} 
                          onPress={() => this.signIn(this.state.email, this.state.password)}>
          <Text style={styles.buttonText}> Sign In </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipLink} onPress={() => this.skipSignIn()}>
          <Text style={styles.skipLinkText}> Skip Registration </Text>
        </TouchableOpacity>

      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  input: {
    marginBottom: "5%",
    marginLeft: "10%",
    marginRight: "10%",
    height: 35,
    borderColor: "#C0C0C0",
    borderBottomWidth: 1
  },
  button: {
    backgroundColor: "black",
    padding: 7,
    marginTop: "5%",
    marginLeft: "13%",
    marginRight: "13%",
    alignItems: "center",
    height: 35
  },
  buttonText: {
    color: "white"
  }, 
  skipLink: {
    marginTop: "5%",
    marginLeft: "40%"
  },
  skipLinkText: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
