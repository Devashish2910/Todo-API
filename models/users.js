const bcrypt = require('bcryptjs');
const _ = require('underscore');
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('users', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    salt: {
      type: DataTypes.STRING

    },
    hashed_password: {
      type: DataTypes.STRING

    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        len: [7, 50]
      },
      set: function(val){
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(val, salt);

        this.setDataValue('password', val);
        this.setDataValue('salt', salt);
        this.setDataValue('hashed_password', hash);
      }
    }
  }, {
    hooks: {
      beforeValidate: (users, options) => {
      if(typeof users.email === 'string') {
        users.email = users.email.toLowerCase();
       }
     }
   },
   classMethods: {
     authentication: function(body) {
       return new Promise((resolve, reject) => {
         // check validations
         if(!_.isString(body.email) && !_.isString(body.password)) {
           // return 400
           return reject();
         }

         // check in database
         users.findOne({
           where: {
             email: body.email
           }
         })
         .then(cur => {
           if(!cur || !bcrypt.compareSync(body.password, cur.get('hashed_password'))) {
             return reject();
           }
           resolve(cur);
         })
         .catch(cur => {
           return reject();
         });
       });
     }
   },
   instanceMethods: {
			toPublicJSON: function (cur) {
				var json = cur.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			}
		}
  }
);
};
