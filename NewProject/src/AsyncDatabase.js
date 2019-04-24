
import AsyncStorage from '@react-native-community/async-storage'

class AsyncDatabase {

    setData = (key,data) => new Promise((resolve,reject) => {
        try {
            key = ''+key;
            resolve(AsyncStorage.setItem(key, data));
        }catch (error) {
            reject(error.message);
        }
    });

    getData = (key) => new Promise((resolve,reject) => {
        try {
            key = ''+key;
            resolve(AsyncStorage.getItem(key));
        }catch (error) {
            reject(error.message);
        }
    });

    removeData = (key) => new Promise((resolve,reject) => {
        try{
            key = ''+key;
            resolve(AsyncStorage.removeItem(key));
        }catch(error){
            reject(error.message);
        }
    });
}

syncDB = new AsyncDatabase();
export default syncDB;