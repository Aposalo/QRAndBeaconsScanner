import React from 'react';
import {View, TouchableOpacity, Image, Text, PermissionsAndroid} from 'react-native';
import asyncDB from '../AsyncDatabase'
import localDatabase from '../SQLiteDatabase'
import request from '../events/RequestMaker'
import styles from './Styles.js';

var sync = asyncDB;
var user;

export default class HomeScreen extends React.Component {

    static navigationOptions = {
        headerTitle: 'Home Page',
      };
    
    constructor() {
        super();
        this.setUser();
        this.state = {
            renderMap: false,
        }
        this.db = localDatabase
    }

    componentDidMount() {
        this.requestLocationPermission().then(() => {
            this.setState({
                renderMap: true
            });
        }).catch((error) => {
            console.log(error);
            return error;
        });
    }

    displayData = (event) => new Promise(async(resolve, reject) => {//spinning screen, Move to HistoryScreen
        makeRequest = new request();
        key = 'type';
        let type = { 'type': event };
        type = JSON.stringify(type);
        await sync.setData(key, type);
        await makeRequest.sendHTTPRequest(key, 'GET', '');
        resolve(makeRequest.getResponce());
        this.data = makeRequest.getResponce();
      });

    gotoHistoryScreen = async(history) => {
        await this.displayData(history);
        await sync.setData(history, this.data);
        this.props.navigation.navigate('HistoryScreen', {event: history});
    }

    showCurrentEvents = async() => {
        await this.db.getLocalEvents();
        this.props.navigation.navigate('HistoryScreen', {event: 'currentEvents'});
    }

    render(){
        if (!this.state.renderMap) {
            return null
        }
        return (
            <View style = {styles.container}>
            <Text style = {styles.buttonBlackText}> {user} </Text>
                <View style = {styles.map}>
                    <TouchableOpacity style = {styles.button_HOME} onPress = {() => this.gotoHistoryScreen('QREvents')}>
                        <Text style = {styles.buttonText}> Show QR </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.button_HOME} onPress = {() => this.gotoHistoryScreen('BeaconEvents')}>
                        <Text style = {styles.buttonText}> Show Beacons </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.button_HOME} onPress = {() => this.showCurrentEvents()}>
                        <Text style = {styles.buttonText}> Show Current Events </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttons}>

                    <TouchableOpacity onPress = {() => this.props.navigation.navigate('BeaconScanningScreen')}>

                        <Image
                            style = {{flex: 0.5,aspectRatio: 1.0}}
                            source = {require('../icons/beacon_blue.png')}
                            resizeMode = 'contain'
                        />

                        <Text style = {{fontSize: 12,position: 'relative',right: 22}}>
                           Beacon scanning
                        </Text>

                    </TouchableOpacity>

                    <TouchableOpacity onPress = {() => this.props.navigation.navigate('QRscanningScreen')}>

                        <Image
                            style = {{flex: 0.5, aspectRatio: 1.0}}
                            source={require('../icons/qr_icon.png')}
                            resizeMode = 'contain'
                        />

                        <Text style = {{fontSize: 12,position: 'relative',right: 15}}>
                            QR scanning
                        </Text>

                    </TouchableOpacity>

                    <TouchableOpacity onPress = {() => this.props.navigation.navigate('LogInScreen')}>

                        <Image
                            style = {{flex: 0.5, aspectRatio: 1.0}}
                            source={require('../icons/log_out.png')}
                            resizeMode = 'contain'
                        />

                        <Text style = {{fontSize: 12,position: 'relative',right: 5}}>
                            Log Out
                        </Text>

                    </TouchableOpacity>

                </View>
            </View>
        ); 
    }

    setUser = async() => {
        user = await sync.getData('user');
        user = JSON.parse(user).username;
        return user;
    }

    requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location Permission',
                message: 'This App requires location in order to work',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
            );
            if (granted === PermissionsAndroid.RESULTS.DENIED) {
                this.props.navigation.navigate('Home');
            } 
        } catch (err) {
            Alert.alert(err);
        }
    }
  }