import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import asyncDB from '../AsyncDatabase'
import styles from './Styles.js';

var sync = asyncDB
var Data

export default class HistoryScreen extends React.Component {

  constructor() {
    super();
    this.state = {// ginete gt alliws h o8onh den deixnei tipota, kai prepei na thn ksananoikseis
      renderHistory: false,
    }
  }

  displayData = async() => {
    const { navigation } = this.props;
    try{
      Data = await sync.getData(navigation.getParam('event'))
    }
    catch(error){
      console.log(error)
    }
  }

  componentDidMount () {
    this.displayData().then(() => {
      this.setState( { renderHistory: true } );
    }).catch((error) => {
            return error;
    });
  }

  render () {
    if (!this.state.renderHistory) {
      return null;
    }
    return (
      <ScrollView style = {styles.container}>
        <View style = {styles.map}>
          <Text style = {styles.buttonBlackText}>
            {Data}
           </Text>
        </View>
      </ScrollView>
    );
  }
}
