
import NetInfo from '@react-native-community/netinfo'
import localDatabase from './SQLiteDatabase';
import {Alert} from 'react-native'

class Connectivity {

  constructor() {
    this.state = {
      connected: true
    }
    this.db = localDatabase;
  }

  listener = async() => {
    NetInfo.getConnectionInfo().then(connectionInfo  => {
      if (connectionInfo.type == 'wifi') {
        if (this.state.connected) {
          this.db.setEventDatabase();
          this.state.connected = false;
        }
        else {
          this.state.connected = true;
        }  
      }
      else {
        Alert.alert("Web is down",'Some functions may no longer occur');
      }
    });
  };

  subscription = NetInfo.isConnected.addEventListener('connectionChange', this.listener);

}

connectInfo = new Connectivity()
export default connectInfo
