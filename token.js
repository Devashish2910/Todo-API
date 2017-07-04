const crypto = require('crypto-js');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

module.exports = function(idOfData, typeOfData) {

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
}
