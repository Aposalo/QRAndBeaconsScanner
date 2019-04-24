import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

const ELEMENT_WIDTH_HISTORY = width - 40
const ELEMENT_WIDTH_HOME = width - 240

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },

  flatlist: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'stretch'
  },

  buttonStyle: {
    flexDirection: 'row',
    justifyContent: 'center'
  },

  item: {
    fontSize: 13
  },

  map: {
    flex: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    marginLeft: 40
  },

  buttonHistory: {
    backgroundColor: '#000000',
    width: ELEMENT_WIDTH_HISTORY,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10
  },

  buttonText: {
    color: '#00FF00',
    fontWeight: '500',
    fontSize: 16
  },

  buttonBlackText: {
    color: '#000000',
    fontWeight: '500',
    fontSize: 16
  },

  button_HOME: {
    backgroundColor: '#000000',
    width: ELEMENT_WIDTH_HOME,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10
  },

  input: {
    width: ELEMENT_WIDTH_HISTORY,
    fontSize: 16,
    height: 36,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#888888',
    borderWidth: 1,
    marginHorizontal: 20,
    marginBottom: 10
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#000000',
    width: ELEMENT_WIDTH_HISTORY,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10
  }
})
