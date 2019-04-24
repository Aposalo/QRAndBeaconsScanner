import React from 'react'
import {Text, View, TouchableOpacity, TextInput, Alert, BackHandler} from 'react-native'
import request from '../events/RequestMaker';
import asyncDB from '../AsyncDatabase'
import styles from './Styles.js';
import localDatabase from '../SQLiteDatabase';

export default class LogInScreen extends React.Component {

  static navigationOptions = {
    headerTitle: 'QR And Beacons Scanner',
  };

  constructor () {
    super();
    this.state = {
      username: '',
      password: ''
    }
  }

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', function () {
      return true
    });
  }

  render () {
    return (
      <View style = {styles.container}>
      <View style = {styles.map}>
        <TextInput
          style = {styles.input}
          onChangeText = {(username) => {
            return this.setState({ username });
          }}
          placeholder = 'Username'
          autoCapitalize = 'none'
          autoCorrect = {false}
          keyboardType = 'default'
        />

        <TextInput
          style = {styles.input}
          onChangeText = {(password) => {
            return this.setState({ password });
          }}
          placeholder = 'Password'
          autoCapitalize = 'none'
          autoCorrect = {false}
          secureTextEntry
        />

        <TouchableOpacity style = {styles.button} onPress = {() => this.logIn()}>
          <Text style = {styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress = {() => this.props.navigation.navigate('SignUpScreen')}>
          <Text style = {styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress = {() => BackHandler.exitApp()}>
          <Text style = {styles.buttonText}>Exit</Text>
        </TouchableOpacity>

        </View>
      </View>
    )
  }

  logIn = async() => {
    try{
      localDatabase.initDatabase();
      makeRequest = new request();
      var sync = asyncDB;
      user = JSON.stringify({"username": this.state.username, "password": this.state.password, "type" : ""});
      await sync.setData('user', user);
      await makeRequest.sendHTTPRequest('user', 'POST', 'log-in')
      var tkn = makeRequest.getResponce();
      if (tkn === 'error') {
        Alert.alert('Wrong username or password.\nPlease try again.');
      } else {
        await sync.setData('token', tkn);
        this.props.navigation.navigate('Home',{user: user});
      }
    }
    catch(error) {
      console.log(error)
    }
 }
}