import HomeScreen from './screens/HomeScreen'
import QRScanningScreen from './screens/QRScanningScreen'
import BeaconScanningScreen from './screens/BeaconScanningScreen'
import LogInScreen from './screens/LogInScreen'
import SignUpScreen from './screens/SignUpScreen'
import HistoryScreen from './screens/HistoryScreen'

export default Routes = {

  mainApp: {
    Home: {
      screen: HomeScreen
    },
    QRscanningScreen: {
      screen: QRScanningScreen
    },
    BeaconScanningScreen: {
      screen: BeaconScanningScreen
    },
    HistoryScreen: {
      screen: HistoryScreen
    }
  },
  Authentication: {
    LogInScreen: {
      screen: LogInScreen
    },
    SignUpScreen: {
      screen: SignUpScreen
    }
  }
}
