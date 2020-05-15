const Cryptr = require('cryptr');
const cryptr = new Cryptr('mailKey');

module.exports.encrypt = function(name, callback){
    const encrypted = cryptr.encrypt(name);
    callback(encrypted);
};

module.exports.decrypt = function(encryptedString, callback){
    const decryptedString = cryptr.decrypt(encryptedString);
    callback(decryptedString)
}
