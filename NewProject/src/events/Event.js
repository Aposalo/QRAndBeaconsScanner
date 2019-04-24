import Geolocation from 'react-native-geolocation-service';

export default class Event {

    constructor(data,type){
        this.data = data;
        this.db = localDatabase;
        this.type = type;   
    }

    getLocation = () => new Promise((resolve,reject)=> {
        Geolocation.getCurrentPosition(
            (position) => {
               resolve(position);
            },
            (error) => {
                reject(error);
            },
            { enableHighAccuracy: true, timeout: 1500000, maximumAge: 1000000 }
        );
    })

    setLocation = (location) => {
        this.location = location;
    }

    getEventsTimestamp = () => {
        curDate = new Date();
        return `${curDate.getDate()}/${curDate.getMonth()+1}/${curDate.getFullYear()} @ ${curDate.getHours()}:${curDate.getMinutes()}:${curDate.getSeconds()}`
    }

    setEventsTimestamp = (timestamp) => {
        this.timestamp = timestamp;
    }

    dataToJSON = () => {
        const data = {"timeStamp": this.timestamp,"location": this.location.coords,"data":this.data, "type":this.type};
        return JSON.stringify(data);
    }
}