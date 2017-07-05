const crypto = require('crypto-js');
const _ = require('underscore');

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('token', {
        token: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            set: function (val) {
                //const salt = bcrypt.genSaltSync(10);
                const hash = crypto.MD5(val).toString();
                this.setDataValue('token', val);
                this.setDataValue('hashed_token', hash);
            }
        },
        hashed_token: {
            type: DataTypes.STRING
        }
    });
};
