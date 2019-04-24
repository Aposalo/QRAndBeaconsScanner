import React from 'react'
import {Text, View, TouchableOpacity, TextInput, Alert} from 'react-native'
import request from '../events/RequestMaker';
import asyncDB from '../AsyncDatabase'
import styles from './Styles.js';

export default class SignUpScreen extends React.Component {

  constructor () {
    super()
    this.state = {
      username: '',
      password: ''
    }
  }
  
  render () {
    return (
      <View style = {styles.container}>
      <View style = {styles.map}>
      
        <TextInput
          style = {styles.input}
          onChangeText = {(username) => this.setState({ username })}
          placeholder = 'Username'
          autoCapitalize = 'none'
          autoCorrect = {false}
          keyboardType = 'default'
          secureTextEntry = {false}
        />

        <TextInput
          style = {styles.input}
          onChangeText = {(password) => this.setState({ password })}
          placeholder = 'Password'
          autoCapitalize = 'none'
          autoCorrect = {false}
          keyboardType = 'default'
          secureTextEntry = {true}
        />

        <TouchableOpacity style = {styles.button} onPress={() => this.signUp()}>
          <Text style = {styles.buttonText}> Create New Account </Text>
        </TouchableOpacity>

        </View>
      </View>
    )
  }

  signUp = async() => {
    makeRequest = new request();
    var sync = asyncDB;
    user = JSON.stringify({"username": this.state.username,"password": this.state.password, "type" : ""});
    await sync.setData('user', user);
    await makeRequest.sendHTTPRequest('user', 'POST', 'sign-up')
    var tkn = makeRequest.getResponce();
    if (tkn === 'error') {
      Alert.alert('This user name already exists\nPlease try another name.')
    } else if (tkn === 'registered') {
      this.props.navigation.navigate('LogInScreen')
    }
  }
}
