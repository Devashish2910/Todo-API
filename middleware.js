const token = require('./token.js')();
const crypto = require('crypto-js');
const db = require('./db.js');
module.exports = function() {
  return {
    requireAuthentication: function(req, res, next) {
        const requestHeader = req.get('Auth');

        db.token.findOne({
          where: {
            hashed_token: crypto.MD5(requestHeader).toString()
          }
        })
        .then(tokenInstance => {
          req.token = tokenInstance;
          // custom method
          token.findByToken(requestHeader)
          .then(cur => {
            req.user = cur;
            next();
        });
        }).catch(err => {
          //console.log("Deva");
          res.status(401).send();
        });
    }
  };
}
