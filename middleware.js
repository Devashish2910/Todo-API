const token = require('./token.js')();
module.exports = function() {
  return {
    requireAuthentication: function(req, res, next) {
        const requestHeader = req.get('Auth');

        // custom method
        token.findByToken(requestHeader)
        .then(cur => {
          req.user = cur;
          next();
        }).catch(err => {
          //console.log("Deva");
          res.status(401).send();
        });
    }
  };
}
