import { RNCamera } from 'react-native-camera';
import {View, Alert } from 'react-native';
import React from 'react';
import Event from '../events/Event';
import localDatabase from '../SQLiteDatabase';
import styles from './Styles.js';

export default class QRScanningScreen extends React.Component{
    
    constructor() {
        super();
        this.db = localDatabase;   
    }

    sendBarcodeEvent = async (barcodes) => {
        QREvent = new Event (barcodes[barcodes.length-1].data,'QREvents');
        let location;
        try {
            location = await QREvent.getLocation();
        } catch (error) {
            console.log(error);
            return;
        }
        QREvent.setLocation(location);
        QREvent.setEventsTimestamp(QREvent.getEventsTimestamp());
        await this.db.registerEvent(QREvent);
        let v = QREvent.dataToJSON();
        Alert.alert('Event Captured',`Do you want to Send the QR Event.\n${QREvent.data}`,[
            {text: 'Cancel', onPress: () => {this.camera.resumePreview()}, style: 'cancel' },
            {text: 'OK', onPress: () => {
                this.db.displayLastInput(v);
                this.camera.resumePreview();
            }}
        ],{cancelable: false},
        );
    }

    render(){
        return(
            <View style = {styles.container}>
                <RNCamera
                    ref = {ref => {
                        this.camera = ref;
                      }}
                      style = {styles.preview}
                      type = {RNCamera.Constants.Type.back}
                      flashMode = {RNCamera.Constants.FlashMode.auto}
                      captureAudio = {false}
                      permissionDialogTitle = {'Permission to use camera'}
                      permissionDialogMessage = {'We need your permission to use your camera phone'}
                      onGoogleVisionBarcodesDetected = {({ barcodes }) => {
                        this.camera.pausePreview();
                        this.sendBarcodeEvent(barcodes);
                        }}
                    />
            </View>
        );
    }
}