const crypto = require('crypto-js');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const db = require('./db.js');

module.exports = function() {
  return {
    createToken: function(idOfData, typeOfData) {
      if(!_.isString(typeOfData) && !_.isInteger(idOfData)) {
        return undefined;
      }
      try {
        const stringData = JSON.stringify({
          id: idOfData,
          type: typeOfData
        });
        const encryptedData = crypto.AES.encrypt(stringData, 'abc123').toString();
        const token = jwt.sign({
          token: encryptedData
        }, '123abc');

        return token;

      } catch(err) {
        console.error(err);
        return undefined;
      }
    },
    findByToken: function(token) {
      return new Promise((resolve, reject) => {
        try {
          //decode JWT
                const decodeJWT =  jwt.verify(token, '123abc');
        // decode of the token
                const bytes = crypto.AES.decrypt(decodeJWT.token, 'abc123');
                const tokenData = JSON.parse(bytes.toString(crypto.enc.Utf8));
        // return user data
        //console.log(typeof tokenData.id + " " + tokenData.id);
                db.users.findById(parseInt(tokenData.id)).then(user => {
                  if(user) {
                    resolve(user);
                  } else {
                    reject();
                  }
                }).catch(() => {
                  reject();
                });
      } catch(e) {
        reject();
      }

      });
    }
  }
};
