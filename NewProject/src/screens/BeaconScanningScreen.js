import { BleManager, State } from 'react-native-ble-plx';
import Beacons from 'react-native-beacons-manager';
import React from 'react';
import { Alert, Button, View, FlatList, Text, DeviceEventEmitter } from 'react-native';
import Event from '../events/Event';
import localDatabase from '../SQLiteDatabase';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from './Styles.js';

export default class BeaconScanningScreen extends React.Component {
    constructor() {
        super();
        this.manager = new BleManager();
        this.state = {
            isRenderingButton: false,
            allBeaconDevices: [],
            toggleButton: false,
        }
        this.allBeacons = [];
        beaconsDidRangeEvent = null;
        this.db = localDatabase;
    }

    startScanning = async () => {
        this.setState({isRenderingButton: true});
        await Beacons.startRangingBeaconsInRegion('Region1');
    }

    pressedOk = async () => {
        await this.manager.enable();
        this.startScanning();
    }

    pressedCancel = () => {
        this.props.navigation.navigate('Home');
    }

    requestToEnableBluetooth = async () => {
       const currState =  await this.manager.state();
       if (currState === State.PoweredOff) {
            Alert.alert('Bluetooth is currently disabled to continue you must enable it','Do you want to enable Bluetooth',[
                {text: 'Cancel', onPress: this.pressedCancel, style: 'cancel' },
                {text: 'OK', onPress: this.pressedOk}
            ], {cancelable: false},
            );
       } else if (currState === State.PoweredOn) {
           this.startScanning();
       }
    }

    registerBeaconRangingEvents = () => {
        this.beaconsDidRangeEvent = DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
            data.beacons.forEach(beacon => {
                if (!this.allBeacons.some(e => {
                    if (beacon.protocol === 'IBeacon') {
                        return (e.major === beacon.major && e.minor === beacon.minor)
                    }
                    return e.instanceId === beacon.instanceId
                })){
                    if (beacon.protocol === 'IBeacon'){
                        this.allBeacons.push({uuid: beacon.uuid, major: beacon.major, minor: beacon.minor});
                    } else {
                        this.allBeacons.push({uuid: beacon.uuid, instanceId: beacon.instanceId})
                    }
                    this.setState({allBeaconDevices: this.allBeacons});
                }
            });
        });
    }

    buttonPress = async () => {
        if (!this.state.toggleButton) {
            await Beacons.stopRangingBeaconsInRegion('Region1');

    
        } else {
            this.startScanning();
        }
        this.setState((previousState) => {
            return {
                toggleButton: !previousState.toggleButton
            }
        });

    }

    renderItems = ({item}) => {
        if(item.minor){
            return (
                <TouchableOpacity onPress = { () => {const selectedBeacon =`${item.uuid}/${item.major}/${item.minor}`;this.sendBeaconEVent(selectedBeacon)}}>
                    <Text style = {styles.item}>
                        {item.uuid} --- {item.major} --- {item.minor}
                    </Text>
                </TouchableOpacity>
            
            );
        }
            return (
                <TouchableOpacity onPress = { () => {const selectedBeacon = `${item.uuid}/${item.instanceId}`;this.sendBeaconEVent(selectedBeacon)}}>
                    <Text style = {styles.item}>
                        {item.uuid} --- {item.instanceId}
                    </Text>
                </TouchableOpacity>
            );
        
    }

    sendBeaconEVent = async (beacon) => {
        beaconEvent = new Event(beacon,'BeaconEvents');
        let location;
        try {
            location = await beaconEvent.getLocation();
        } catch (error) {
            console.log(error);
            return;
        }
        beaconEvent.setLocation(location);
        beaconEvent.setEventsTimestamp(beaconEvent.getEventsTimestamp());
        await this.db.registerEvent(beaconEvent);
        let v = beaconEvent.dataToJSON();
        this.db.displayLastInput(v);
    }

    render(){
        const buttonTitle = !this.state.toggleButton ? 'Stop Scanning' : 'Start Scanning';
        const buttonColor = !this.state.toggleButton ? 'red' : 'darkblue' ;
        let i =0;
        if (!this.state.isRenderingButton) {
            return null;
        }
        if (this.state.allBeaconDevices.length > 0 || this.state.isRenderingButton) {
            return (
                <View style={styles.container}>

                    <View style ={styles.flatlist}>
                        <FlatList data={this.state.allBeaconDevices}
                        extraData = {this.state}
                        renderItem = {this.renderItems}
                        keyExtractor = {item => (i++).toString()}
                        />
                    </View>

                    <View style ={styles.buttonStyle}>
                        <Button
                            onPress = {this.buttonPress}
                            title = {buttonTitle}
                            color = {buttonColor}
                        />
                    </View>

                </View>
            );
        }
    }

    componentDidMount() {
        this.registerBeaconRangingEvents();
        this.requestToEnableBluetooth();
    }

    componentWillUnmount() {
        Beacons.stopRangingBeaconsInRegion('Region1').then(() => {this.beaconsDidRangeEvent.remove();});
    }
}

