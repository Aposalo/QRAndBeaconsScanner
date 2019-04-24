// iv and key must be stored somewhere locally (maybe on a file)

const Crypto = require('crypto');
const IV = 'qghkutlcqghkutlc';
const key = 'mx.24s/zqghkutlc';

class Encryption {

    encrypt =  (data) => {

        return new Promise((resolve,reject) => {
            try {
                const cipher = Crypto.createCipheriv('aes-128-cbc' , key,IV);
                let encrypted = cipher.update(data,'utf8', 'hex');
                encrypted += cipher.final('hex');
                resolve (encrypted);
            }catch (err){
                reject(err);
            }
        })
    } 
        

    decrypt =  (data) => {

        return new Promise((resolve,reject) => {
            try{
                const decipher = Crypto.createDecipheriv('aes-128-cbc' , key, IV);
                let decrypted = decipher.update(data, 'hex', 'utf8');
                decrypted += decipher.final('utf8');
                resolve(decrypted);
            }catch (err){
                reject(err);
            }
        })
    } 
       
}
module.exports = Encryption;
module.exports = Encryption;