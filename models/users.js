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
            set: function (val) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(val, salt);
                this.setDataValue('password', val);
                this.setDataValue('salt', salt);
                this.setDataValue('hashed_password', hash);
            }
        }
    }, {
        hooks: {
            beforeValidate: function (user, options) {
                // user.email
                if (typeof user.email === 'string') {
                    user.email = user.email.toLowerCase();
                }
            }
        }
    });

};
