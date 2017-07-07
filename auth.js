const bcrypt = require('bcryptjs');
const db = require('./db.js');
const _ = require('underscore');
const crypto = require('crypto-js');

module.exports = function(body) {
  return new Promise((resolve, reject) => {
    db.users.findOne({where: { email: body.email}}).then((user) => {
      if (bcrypt.compareSync(body.password, user.get('hashed_password'))) {
        //let publicDetails = user.toJSON();
        //publicDetails = _.pick(publicDetails, 'id', 'email');
        resolve(user);
      } else { 
        reject();
      }
    }).catch(() => {
      reject();
    });
  });
};
