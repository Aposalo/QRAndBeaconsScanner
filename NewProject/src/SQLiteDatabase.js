import SQLite from 'react-native-sqlite-storage';
import request from './events/RequestMaker';
import asyncDB from './AsyncDatabase'

var sync = asyncDB;

 class SQLiteDatabase {

    constructor() {
        this.db = SQLite.openDatabase({name: 'EventDatabase', createFromLocation : 1},this.onOpened, this.onError);
    }

    onOpened = () => {
        console.log('Database has opened sucessfully');
    }

    onError = () => {
        console.log('Error opening Database');
    }

    initDatabase = () => {
        this.dropTables();
		this.db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS Event( '
            + 'Event_id INTEGER PRIMARY KEY AUTOINCREMENT, '
            + 'eventType TEXT, '
            + 'timeStamp TEXT, '
            + 'speed INTEGER, '
            + 'heading INTEGER, '
            + 'accuracy FLOAT, '
            + 'altitude FLOAT, '
            + 'longitude FLOAT, '
            + 'latitude FLOAT, '
            + 'data TEXT ); ', []);
        });
    }


    getLocalEvents = () => new Promise (async(resolve, reject) => {
        this.db.transaction((tx) => {
            tx.executeSql('SELECT * FROM Event', [], async(tx, results) => {
                var len = results.rows.length;
                let data = '[\n';
                for (let i = 0; i < len; i++) {
                    data = data + '{\n';
                    data = data + 'Event_id: ' + results.rows.item(i).Event_id + ',\n';
                    data = data + 'eventType: ' + results.rows.item(i).eventType + ',\n';
                    data = data + 'timeStamp: ' + results.rows.item(i).timeStamp + ',\n';
                    data = data + 'speed: ' + results.rows.item(i).speed + ',\n';
                    data = data + 'heading: ' + results.rows.item(i).heading + ',\n';
                    data = data + 'accuracy: ' + results.rows.item(i).accuracy + ',\n';
                    data = data + 'altitude: ' + results.rows.item(i).altitude + ',\n';
                    data = data + 'longitude: ' + results.rows.item(i).longitude + ',\n';
                    data = data + 'latitude: ' + results.rows.item(i).latitude + ',\n';
                    data = data + 'data: ' + results.rows.item(i).data + '\n';
                    data = data + '}\n';
                }
                data = data + ']'
                resolve(await sync.setData('currentEvents', data));
            });
        });
    });

    setEventDatabase = () => {
        this.db.transaction((tx) => {
        tx.executeSql('SELECT * FROM Event', [], async(tx, results) => {
                var len = results.rows.length;
                for (let i = 1; i < len + 1; i++) {
                    try{
                        makeRequest = new request();
                        await makeRequest.createRequest(i, 'POST', 'new');
                    }
                    catch(error){}
                }
        });
    });
    };

    dropTables = () => {
        this.db.transaction((tx) => {
            tx.executeSql('DROP TABLE IF EXISTS Event;');
        })
    }

    registerEvent = (event) => new Promise (async(resolve, reject) => {
        let data = `${event.data}`;
        resolve(this.db.transaction((tx) => {
            tx.executeSql(`INSERT INTO Event (eventType, timeStamp, speed, heading, accuracy, altitude, longitude, latitude, data) VALUES ("${event.type}","
            ${event.getEventsTimestamp()}", ${event.location.coords.speed}, ${event.location.coords.heading}, ${event.location.coords.accuracy}, 
            ${event.location.coords.altitude}, ${event.location.coords.longitude}, ${event.location.coords.latitude}, "${data}");`,[]);
        }));
    });

	displayLastInput = (v) => {
		this.db.transaction((tx) => {
			tx.executeSql('SELECT ROWID FROM Event ORDER BY ROWID DESC LIMIT 1',[], async(tx,results) => {
               i = (results.rows.item(0).Event_id);
               await sync.setData(i, v);
               try{
                    makeRequest = new request();
                    await makeRequest.createRequest(i, 'POST', 'new');
                }
                catch(error){}
            });
		});
    };
}

localDatabase = new SQLiteDatabase();
export default localDatabase;