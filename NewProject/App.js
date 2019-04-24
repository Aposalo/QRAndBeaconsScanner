/**
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

// USE A STATE MANAGER TO HANDLE GLOBAL APP STATE (LIKE RENDERING THE RELOADING BAR FROM WHEREVER)

import React, { Component } from 'react'
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation'
import Routes from './src/Routes'
import Connectivity from './src/Connectivity'

const MainAppNavigator = createStackNavigator(Routes.mainApp)
const AuthNavigator = createStackNavigator(Routes.Authentication)
const AppNavigator = createAppContainer(createSwitchNavigator(
  {
    MainApp: MainAppNavigator,
    Authentication: AuthNavigator
  },
  {
    headerMode: 'screen',
    initialRouteName: 'Authentication'
  },
  {
    headerMode: 'screen',
    initialRouteName: 'MainApp'
  }))
const AppContainer = createAppContainer(AppNavigator)

export default class App extends Component {
  render () {
    var connection = Connectivity
    connection.subscription
    return (
      <AppContainer
      />
    )
  }
}
