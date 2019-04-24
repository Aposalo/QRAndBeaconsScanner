
import asyncDB from '../AsyncDatabase'

var sync = asyncDB;
var address = 'http://192.168.30.203:9999/User/'// TODO react-native-network-info gia opoiadhpote topikh dieu8unsh
var tkn;

export default class RequestMaker{

    constructor() {
        this.request = new XMLHttpRequest();
        this.request.timeout = 1000;
    }

    getResponce = () => {
        return this.request.response;
    }

    createRequest = async(key, method, post) => new Promise (async(resolve, reject) => {
        this.key = key;
        this.method = method;
        this.post = post;
        let s = await sync.getData(key);
        if (s !== null) {
            await this.sendHTTPRequest(key, method, post);
            if (this.request.status === 200) {
                await sync.removeData(key)
                resolve("success")
            }
        }
        else {
            reject('error');
        }
    });

    readyState = (resolve, reject) => {
        this.request.onreadystatechange = async(e) => {
            if (this.request.readyState !== 4) {
                return;
            }
            if (this.request.status === 200) {
                resolve({status: 200, response: this.request.response});
            } else if (this.request.status === 0) {
                try {
                    this.request.abort();
                    return;
                }
                catch(error) {
                    reject(error);
                    return;
                }
            } else if (this.request.status === 498) {
                try {
                    this.request.abort();
                    await this.updateToken();
                    const accessToken = this.getResponce();
                    const refreshToken = JSON.parse(tkn).refreshToken;
                    let token = { accessToken: accessToken, refreshToken: refreshToken }
                    token = (JSON.stringify(token, null, '\t'))
                    await sync.setData('token', token)
                    this.request.abort();
                    this.createRequest(this.key, this.method, this.post);
                }
                catch(error) {
                    reject(error);
                }
            }
        }
    }

    updateToken = () => new Promise (async(resolve, reject) => {
        tkn = await sync.getData('token');
        this.readyState(resolve, reject);
        this.request.open('GET', address+'/'+'refresh',true);
        this.request.setRequestHeader('x-access-token',JSON.parse(tkn).refreshToken);
        this.request.setRequestHeader('Content-Type','application/json');
        this.request.send(tkn);
    });

    sendHTTPRequest = (key, method, post) => new Promise (async(resolve, reject) => {
            dataToSend = await sync.getData(key);
            tkn = await sync.getData('token');
            this.readyState(resolve, reject);
            this.request.open(method, address+JSON.parse(dataToSend).type+'/'+post, true);
            if(key !== 'user') {
                this.request.setRequestHeader('x-access-token', JSON.parse(tkn).accessToken);// stelnei ta stoixeia ston katallhlo xrhsth
            }
            this.request.setRequestHeader('Content-Type','application/json');
            this.request.send(dataToSend);

   });
}
